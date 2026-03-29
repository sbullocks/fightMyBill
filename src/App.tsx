import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { theme } from '@/theme/muiTheme'
import { AppRouter } from '@/routes/AppRouter'
import { supabase } from '@/lib/supabaseClient'
import { setSession } from '@/features/auth/authSlice'

function AppWithAuth() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      store.dispatch(setSession({ user: data.session?.user ?? null, session: data.session }))
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setSession({ user: session?.user ?? null, session }))
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return <AppRouter />
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppWithAuth />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
