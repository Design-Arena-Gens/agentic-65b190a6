export const metadata = {
  title: 'LinkedIn Post Agent',
  description: 'AI-powered LinkedIn post generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
