import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

const isloggedin = localStorage.getItem("user") ? true : false;
const pages = [
  {
    label: " 🏠 Dashboard",
    path: "/",
    enable: isloggedin,
  },
  {
    label: "📋 Add/View Data",
    path: "/view-data",
    enable: isloggedin,
  },
  {
    label: "📈 Campaign History",
    path: "/campaign-history",
    enable: isloggedin,
  },
  {
    label: "Logout",
    path: "/login",
    enable: isloggedin,
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            CRM
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) =>
                page.label === "Logout" ? (
                  <MenuItem
                    key={page.label}
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                    hidden={page.enable ? false : true}
                  >
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      ⍈ {page.label}
                    </Typography>
                  </MenuItem>
                ) : (
                  page.enable && (
                    <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                      <Link
                        to={page.path}
                        sx={{ textAlign: "center", color: "black" }}
                      >
                        {page.label}
                      </Link>
                    </MenuItem>
                  )
                )
              )}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            CRM
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) =>
              page.label === "Logout" ? (
                <button
                  key={page.label}
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                  style={{
                    color: "black",
                    display: "block",
                    fontWeight: "bold",
                    margin: "0 5px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  hidden={page.enable ? false : true}
                >
                  ⍈ {page.label}
                </button>
              ) : (
                page.enable && (
                  <Link
                    to={page.path}
                    key={page.label}
                    onClick={handleCloseNavMenu}
                    style={{
                      color: "black",
                      display: "block",
                      fontWeight: "bold",
                      margin: "0 5px",
                    }}
                  >
                    {page.label}
                  </Link>
                )
              )
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
