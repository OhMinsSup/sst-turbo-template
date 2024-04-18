import { Footer } from '~/components/chatbot/footer';
import { Header } from '~/components/chatbot/header';
import { ChatProvider } from '~/services/context/useChatProvider';

interface RoutesProps {
  children: React.ReactNode;
}

export default function Layout(props: RoutesProps) {
  return (
    <ChatProvider>
      <Header />
      {props.children}
      <Footer />
    </ChatProvider>
  );
}
