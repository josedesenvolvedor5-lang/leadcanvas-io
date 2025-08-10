import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppConfig, WhatsAppProvider, WhatsAppStorage, sendWhatsAppText } from '@/lib/integrations/whatsapp';

export function WhatsAppSettings() {
  const [provider, setProvider] = useState<WhatsAppProvider>('cloud-api');
  const [fields, setFields] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const cfg = WhatsAppStorage.load();
    if (cfg) {
      setProvider(cfg.provider);
      if (cfg.provider === 'cloud-api') {
        setFields({ token: cfg.token, phoneNumberId: cfg.phoneNumberId, apiVersion: cfg.apiVersion || '' });
      } else if (cfg.provider === 'twilio') {
        setFields({ accountSid: cfg.accountSid, authToken: cfg.authToken, fromNumber: cfg.fromNumber });
      } else if (cfg.provider === '360dialog') {
        setFields({ apiKey: cfg.apiKey });
      }
    }
  }, []);

  const save = () => {
    try {
      let cfg: WhatsAppConfig | null = null;
      if (provider === 'cloud-api') {
        const { token = '', phoneNumberId = '', apiVersion = '' } = fields;
        cfg = { provider, token, phoneNumberId, apiVersion: apiVersion || undefined } as WhatsAppConfig;
      } else if (provider === 'twilio') {
        const { accountSid = '', authToken = '', fromNumber = '' } = fields;
        cfg = { provider, accountSid, authToken, fromNumber } as WhatsAppConfig;
      } else if (provider === '360dialog') {
        const { apiKey = '' } = fields;
        cfg = { provider, apiKey } as WhatsAppConfig;
      }
      if (!cfg) throw new Error('Config inválida');
      WhatsAppStorage.save(cfg);
      toast({ title: 'Configurações salvas', description: 'Guardadas no localStorage deste navegador.' });
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e?.message || 'Verifique os campos e tente novamente.', variant: 'destructive' });
    }
  };

  const testSend = async () => {
    const testNumber = prompt('Digite um número para teste (ex: 5511999999999):');
    if (!testNumber) return;
    const res = await sendWhatsAppText({ to: testNumber, body: 'Teste de WhatsApp via frontend (no-cors) ✅' });
    if (res.ok) toast({ title: 'Requisição enviada', description: 'Verifique seu WhatsApp/Zap history. (no-cors)' });
    else toast({ title: 'Falha no envio', description: res.error || 'Veja o console.', variant: 'destructive' });
  };

  const renderFields = () => {
    switch (provider) {
      case 'cloud-api':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="token">Token</Label>
              <Input id="token" type="password" value={fields.token || ''} onChange={e => setFields({ ...fields, token: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="phoneNumberId">Phone Number ID</Label>
              <Input id="phoneNumberId" value={fields.phoneNumberId || ''} onChange={e => setFields({ ...fields, phoneNumberId: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="apiVersion">API Version (opcional)</Label>
              <Input id="apiVersion" placeholder="v19.0" value={fields.apiVersion || ''} onChange={e => setFields({ ...fields, apiVersion: e.target.value })} />
            </div>
          </div>
        );
      case 'twilio':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountSid">Account SID</Label>
              <Input id="accountSid" value={fields.accountSid || ''} onChange={e => setFields({ ...fields, accountSid: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="authToken">Auth Token</Label>
              <Input id="authToken" type="password" value={fields.authToken || ''} onChange={e => setFields({ ...fields, authToken: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="fromNumber">From (whatsapp:+...)</Label>
              <Input id="fromNumber" placeholder="whatsapp:+14155238886" value={fields.fromNumber || ''} onChange={e => setFields({ ...fields, fromNumber: e.target.value })} />
            </div>
          </div>
        );
      case '360dialog':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apiKey">D360-API-KEY</Label>
              <Input id="apiKey" type="password" value={fields.apiKey || ''} onChange={e => setFields({ ...fields, apiKey: e.target.value })} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp</CardTitle>
        <CardDescription>Configure um provedor e salve credenciais no navegador (localStorage). Uso de no-cors com status simulado.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Provedor</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as WhatsAppProvider)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um provedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cloud-api">WhatsApp Cloud API</SelectItem>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="360dialog">360dialog</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {renderFields()}

        <div className="flex gap-2">
          <Button onClick={save}>Salvar</Button>
          <Button variant="secondary" onClick={testSend}>Enviar mensagem de teste</Button>
        </div>
      </CardContent>
    </Card>
  );
}
