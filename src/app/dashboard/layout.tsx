import { QueryProvider } from '@/lib/react-query/provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <QueryProvider>{children}</QueryProvider>
}
