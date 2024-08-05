import { Layout } from "@/components/layout";


export default function LayoutComp({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){

  return <Layout>
    {children}
  </Layout>

}