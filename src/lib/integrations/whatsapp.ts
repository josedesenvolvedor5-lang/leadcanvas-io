// Lightweight front-end only WhatsApp integration using localStorage credentials
// NOTE: This is for demo/dev only. Do NOT use secrets in frontend for production.

export type WhatsAppProvider = 'cloud-api' | 'twilio' | '360dialog';

export interface WhatsAppConfigBase {
  provider: WhatsAppProvider;
}

export interface CloudAPIConfig extends WhatsAppConfigBase {
  provider: 'cloud-api';
  token: string; // Permanent token
  phoneNumberId: string; // e.g. 123456789012345
  apiVersion?: string; // default v19.0
}

export interface TwilioConfig extends WhatsAppConfigBase {
  provider: 'twilio';
  accountSid: string;
  authToken: string;
  fromNumber: string; // whatsapp:+14155238886
}

export interface D360Config extends WhatsAppConfigBase {
  provider: '360dialog';
  apiKey: string; // D360-API-KEY
}

export type WhatsAppConfig = CloudAPIConfig | TwilioConfig | D360Config;

const LS_KEY = 'wa_config_v1';

export const WhatsAppStorage = {
  save(config: WhatsAppConfig) {
    localStorage.setItem(LS_KEY, JSON.stringify(config));
  },
  load(): WhatsAppConfig | null {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  },
  clear() {
    localStorage.removeItem(LS_KEY);
  }
};

export interface SendParams {
  to: string; // E.164 with country, e.g. 5511999999999 or whatsapp:+5511999999999 (provider-dependent)
  body: string;
}

export interface SendResult {
  ok: boolean;
  error?: string;
}

function ensureE164(num: string): string {
  // Remove non-digits and ensure it starts with country code (simple heuristic)
  const digits = num.replace(/\D/g, '');
  return digits.startsWith('+' ) ? digits : `+${digits}`;
}

export async function sendWhatsAppText(params: SendParams): Promise<SendResult> {
  const cfg = WhatsAppStorage.load();
  if (!cfg) return { ok: false, error: 'Configuração do WhatsApp ausente' };

  try {
    switch (cfg.provider) {
      case 'cloud-api': {
        const version = cfg.apiVersion || 'v19.0';
        const url = `https://graph.facebook.com/${version}/${cfg.phoneNumberId}/messages`;
        const payload = {
          messaging_product: 'whatsapp',
          to: ensureE164(params.to),
          type: 'text',
          text: { body: params.body },
        };
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors', // cannot read response; we simulate success
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cfg.token}`,
          },
          body: JSON.stringify(payload),
        });
        return { ok: true };
      }
      case 'twilio': {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}/Messages.json`;
        const form = new URLSearchParams();
        form.set('To', `whatsapp:${ensureE164(params.to)}`);
        form.set('From', cfg.fromNumber.startsWith('whatsapp:') ? cfg.fromNumber : `whatsapp:${cfg.fromNumber}`);
        form.set('Body', params.body);
        const basic = btoa(`${cfg.accountSid}:${cfg.authToken}`);
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: form.toString(),
        });
        return { ok: true };
      }
      case '360dialog': {
        const url = 'https://waba.360dialog.io/v1/messages';
        const payload = {
          to: ensureE164(params.to),
          type: 'text',
          text: { body: params.body },
        };
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
            'D360-API-KEY': cfg.apiKey,
          },
          body: JSON.stringify(payload),
        });
        return { ok: true };
      }
      default:
        return { ok: false, error: 'Provedor não suportado' };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erro ao enviar' };
  }
}
