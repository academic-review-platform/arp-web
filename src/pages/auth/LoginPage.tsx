import { Alert, Box, Button, Link, Paper, TextField, Typography } from "@mui/material";

import { useLogin } from "../../hooks/LoginHook"

const LoginPage = () => {
  const { formik, isLoading, navigate } = useLogin();

  return (
    <div>
      <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
          borderRadius: '16px',
          boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: 600, fontSize: '1.5rem', mb: 1, textAlign: 'center' }}
        >
          Note Validator
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#555', mb: 3, textAlign: 'center', fontSize: '1rem' }}
        >
          Inicia sesión para continuar
        </Typography>

        {formik.status && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formik.status}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={formik.isSubmitting || isLoading || !formik.isValid}
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            Iniciar Sesión
          </Button>
        </Box>

        <Typography sx={{ mt: 2, textAlign: 'center', fontSize: '0.875rem' }}>
          ¿No tienes cuenta?{' '}
          <Link
            component="span"
            onClick={() => navigate('/register')}
            underline="hover"
            sx={{ cursor: 'pointer' }}
          >
            Regístrate
          </Link>
        </Typography>
      </Paper>
    </Box>
    </div>
  )
}

export default LoginPage
