import { Alert, Box, Button, Paper, TextField, Typography, Link } from "@mui/material"

import { useRegister } from "../../hooks/registerHook"

const RegisterPage = () => {
  const { formik, isLoading, navigate } = useRegister();

  return (
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
          Crea tu cuenta
        </Typography>

        {formik.status && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formik.status}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            label="Nombre"
            name="firstname"
            fullWidth
            value={formik.values.firstname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            helperText={formik.touched.firstname && formik.errors.firstname}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Apellido"
            name="lastname"
            fullWidth
            value={formik.values.lastname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
            sx={{ mb: 2 }}
          />
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
          <TextField
            label="Confirmar contraseña"
            name="passwordConfirmation"
            type="password"
            fullWidth
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={formik.isSubmitting || isLoading || !formik.isValid}
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            Registrarse
          </Button>
        </Box>

        <Typography sx={{ mt: 2, textAlign: 'center', fontSize: '0.875rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link
            component="span"
            onClick={() => navigate('/login')}
            underline="hover"
            sx={{ cursor: 'pointer' }}
          >
            iniciar sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default RegisterPage
