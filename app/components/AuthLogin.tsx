import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/dashboard/components/forms/theme-elements/CustomTextField";



const AuthLogin = ({ title, subtitle, subtext, onFormSubmit }:{title?:any,subtitle:any,onFormSubmit:any,subtext:any}) => (
    <>
      {title ? (
          <Typography fontWeight="700" variant="h2" mb={1}>
            {title}
          </Typography>
      ) : null}

    {subtext}
      <form onSubmit={(evt)=> onFormSubmit(evt)}>
        <Stack>
          <Box>
            <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="username"
                mb="5px"
            >
              Email
            </Typography>
            <CustomTextField name={"email"} required type={"email"} variant="outlined" fullWidth/>
          </Box>
          <Box mt="25px">
            <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="password"
                mb="5px"
            >
              Password
            </Typography>
            <CustomTextField name={"password"} required type="password" variant="outlined" fullWidth/>
          </Box>
          <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              my={2}
          >
            <FormGroup>
              <FormControlLabel
                  control={<Checkbox defaultChecked/>}
                  label="Remeber this Device"
              />
            </FormGroup>
            <Typography
                component={Link}
                href="/"
                fontWeight="500"
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
          >
            Sign In
          </Button>
        </Box>
        {subtitle}
      </form>
    </>
);

export default AuthLogin;
