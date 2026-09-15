import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  return (
    <main className="login-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="login-frame grid w-full max-w-5xl overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="login-intro relative hidden min-h-[620px] flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14">
          <div className="relative z-10 flex items-center gap-3">
            <span className="brand-mark">M</span>
            <span className="text-sm font-bold tracking-[0.28em]">MOVED</span>
          </div>

          <p className="relative z-10 text-xs text-white/45">© 2026 MOVED</p>
        </aside>

        <section className="login-panel flex min-h-[620px] items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <span className="brand-mark brand-mark-light">M</span>
                <span className="text-sm font-bold tracking-[0.28em] text-slate-950 dark:text-white">MOVED</span>
              </div>
            </div>

            <Card className="w-full bg-transparent shadow-none ring-0">
              <CardHeader className="p-0">
                <div className="mb-4 flex items-center gap-2 text-xl font-bold uppercase tracking-[0.22em] text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full font-bold" />
                  BIENVENIDO DE NUEVO
                </div>
              </CardHeader>

              <form className="mt-10 space-y-6">
                <CardContent className="space-y-5 p-0">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300" htmlFor="email">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-green-500 focus-visible:ring-green-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300" htmlFor="password">
                        Password
                      </Label>
                      <a href="#" className="text-xs font-semibold text-green-600 underline-offset-4 hover:text-green-700 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input id="password" type="password" className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm shadow-sm focus-visible:border-green-500 focus-visible:ring-green-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" required />
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-3 border-0 p-0">
                  <Button type="submit" className="h-12 w-full rounded-lg bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/15 hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-950 focus-visible:ring-offset-2">
                    Iniciar Sesion <span aria-hidden="true" className="ml-2 text-lg">→</span>
                  </Button>
                  <div className="flex w-full items-center gap-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    o
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <Button type="button" variant="outline" className="h-12 w-full rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                    <span className="mr-2 text-base font-black">G</span> Continue with Google
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
