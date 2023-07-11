import { Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'

const EditUser = ({ user, handleChange }) => {
  return (
    <>
      <Box
        component="div"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={user.name}
              onChange={handleChange}
              autoComplete="given-name"
              autoFocus
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Email Address"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl className="space-x-4">
              <Typography variant='subtitle1'>Gender</Typography>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                id="gender"
                name="gender"
                value={user.gender}
                onChange={handleChange}
                required
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Third" control={<Radio />} label="Third" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="City"
              id="city"
              name="city"
              value={user.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="State"
              id="state"
              name="state"
              value={user.state}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default EditUser