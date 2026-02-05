import { Logo } from "@/components/ui/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="absolute top-8 left-8 sm:left-12 lg:left-16">
          <Logo className="text-lg" />
        </div>
        
        <div className="w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
           <div className="max-w-md text-center">
             <h2 className="text-3xl font-bold mb-4">Armazenamento em Nuvem (Seca)</h2>
             <p className="text-muted-fg text-lg">
               Guarde seus arquivos com segurança. Só não tente baixá-los quando estiver chovendo. Sério.
             </p>
           </div>
        </div>
      </div>
    </div>
  )
}
