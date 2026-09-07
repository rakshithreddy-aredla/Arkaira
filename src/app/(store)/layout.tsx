import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function StorefrontLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
