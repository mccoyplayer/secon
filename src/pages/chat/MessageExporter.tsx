import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toPng, toSvg } from 'html-to-image';
import { DownloadIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { saveAs } from 'file-saver';

import { ChatItemType, useChatStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMobileScreen } from '@/hooks/use-mobile-screen';
import useWechat from '@/hooks/use-wechat';

import { ChatItem } from './ChatItem';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

const MessageExporter = ({ messages, shareUrl }: { messages: ChatItemType[]; shareUrl: string }) => {
  const messagesRef = useRef<HTMLImageElement>(null);
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  const isMobileScreen = useMobileScreen();
  const [currentConversation] = useChatStore((state) => [state.currentConversation]);
  const { isWeixinBrowser } = useWechat();

  const drawImage = async () => {
    setTimeout(async () => {
      if (!messagesRef.current) return;
      // 微信浏览器中 toPng 方法，偶发生成失败，所以使用 toSvg 方法
      const drawImageFn = isWeixinBrowser ? toSvg : toPng;
      const res = await drawImageFn(messagesRef.current, { style: { opacity: '1' } });
      setDataUrl(res);
    }, 300);

    setOpen(true);
  };

  return (
    <>
      {open &&
        createPortal(
          <div ref={messagesRef} className="bg-background p-8">
            <div className="min-h-[10rem]">
              {messages.map((item, index) => (
                <ChatItem key={index} data={item} isDownload />
              ))}
            </div>

            <div className="m-auto mt-10 flex flex-col items-center gap-2">
              <QRCodeCanvas
                style={{
                  width: '8rem',
                  height: '8rem',
                }}
                value={shareUrl}
              />
              <div>扫一扫，马上体验</div>
            </div>
          </div>,
          document.body,
        )}

      <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>对话海报</AlertDialogTitle>
          </AlertDialogHeader>
          <ScrollArea>
            <AlertDialogDescription className="h-[30rem]">
              <img src={dataUrl} alt="" />
            </AlertDialogDescription>
          </ScrollArea>
          {isMobileScreen && <AlertDialogDescription className="text-center">长按图片保存</AlertDialogDescription>}
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            {!isMobileScreen && (
              <AlertDialogAction
                onClick={() => {
                  saveAs(dataUrl, `${currentConversation.title}.jpg`);
                }}
              >
                下载
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        disabled={messages.length === 0}
        variant={'ghost'}
        className="flex w-32 gap-2"
        onClick={() => {
          drawImage();
        }}
      >
        <DownloadIcon size={20} /> 生成图片
      </Button>
    </>
  );
};
export default MessageExporter;
