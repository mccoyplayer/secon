import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getWxQrCode } from '@/api/user';

import { PrivacyProtocol, UseProtocol } from './Protocol';
import { QrCode } from './QrCode';

export default function Login() {
  const [protocolChecked, setProtocolChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleLogin = async () => {
    const currentUrl = location.origin + location.pathname;
    const res = await getWxQrCode('weixinweb', currentUrl);
    setOpen(true);
    setQrCode(res.data.qr_code_url);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-l from-blue-400 to-emerald-400 ">
      <div className="m-auto flex w-4/6 flex-col items-center rounded-xl bg-white pb-20 pt-10 shadow md:w-4/12">
        <img src="https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png" className="mb-4 w-36 rounded-full" />
        <div className="mt-4 text-xl font-bold"> 人 . 机 . 对话 </div>

        <Button className="mb-4 mt-12 w-[70%]" variant={'outline'} disabled={!protocolChecked} onClick={handleLogin}>
          微信扫码登录
        </Button>
        <div className="flex items-center text-xs">
          <Checkbox
            checked={protocolChecked}
            id="terms"
            className="mr-2"
            onCheckedChange={(val) => setProtocolChecked(val as boolean)}
          />
          我已阅读并同意
          <PrivacyProtocol>
            <span className="text-blue-600">《隐私协议》</span>
          </PrivacyProtocol>
          和
          <UseProtocol>
            <span className="text-blue-600">《使用协议》</span>
          </UseProtocol>
        </div>
      </div>
      <QrCode
        open={open}
        qrCode={qrCode}
        handleOpenChange={(val) => {
          setOpen(val);
        }}
      />
    </div>
  );
}
