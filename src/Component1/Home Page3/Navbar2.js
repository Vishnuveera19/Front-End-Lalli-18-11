import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../../serverconfiguration/requestcomp';
import { REPORTS } from '../../serverconfiguration/controllers';
import { ServerConfig } from '../../serverconfiguration/serverconfig';
import settingss from "../../images/Settingss-icon.png";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#fff',
  borderRadius: "5px"
}));

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [employeeFirstName, setEmployeeFirstName] = useState('');
  const [employeeImage, setEmployeeImage] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isLoggedIn = sessionStorage.getItem('user');


  // Fetch employee details based on empCode from sessionStorage
  useEffect(() => {
    async function getData() {
      try {
        const empCode = sessionStorage.getItem('user');
        if (empCode) {
          // Fetch employee data from paym_Employee
          const employeeData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM paym_Employee WHERE EmployeeCode = '${empCode}'`,
          });
      if (employeeData.data && employeeData.data.length > 0) {
            const fullName = employeeData.data[0].Employee_Full_Name;
            const firstName = fullName.split(' ')[0];
            setEmployeeFirstName(firstName);

          if (employeeData.data && employeeData.data.length > 0) {
            const employeeID = employeeData.data[0].pn_EmployeeID;
  
            // Fetch image data from paym_employee_Profile1
            const employeeProfileData = await postRequest(ServerConfig.url, REPORTS, {
              query: `SELECT * FROM paym_employee_Profile1 WHERE pn_EmployeeID = '${employeeID}'`,
            });
  
            if (employeeProfileData.data && employeeProfileData.data.length > 0) {
              const imageData = employeeProfileData.data[0].image_data;
  
              if (imageData) {
                // Prepend the MIME type to the base64 string
                const base64Image = `data:image/jpeg;base64,${imageData}`;
  
                // Set the image for Avatar
                setEmployeeImage(base64Image);
              } else {
                console.log("Image data is null or undefined for Employee ID:", employeeID);
              }
            } else {
              console.log("No matching profile data found for Employee ID:", employeeID);
            }
          }
        }
      } 
    }
    catch (error) {
        console.error('Error fetching employee data:', error);
      }
    }
  
    
    getData();
  }, []);
  
  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.clear();
    // Navigate to login page or any other page you desire
    window.location.href = "http://localhost:3000/";
  };


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!isLoggedIn) {
    // If not logged in, redirect to login page
    return <navigate to="/" />;
  }

  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <IconButton
          size="large"
          edge="start"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="black"
        >
          <img src={settingss} width={25} height={25} alt="Settings" />
        </IconButton>
        Settings
      </MenuItem>

      <MenuItem onClick={handleLogout}>
        <IconButton
          size="large"
          color="black"
          edge="start"
          aria-label="Log out"
        >
          <LogoutIcon />
        </IconButton>
        Logout
      </MenuItem>
    </Menu>
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: "black" }}>
            HRMS
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: 'center' }}>
            {/* Mail Icon with Badge */}
            <IconButton size="large" aria-label="show new mails" color="black">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            {/* Notifications Icon with Badge */}
            <IconButton size="large" aria-label="show new notifications" color="black">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {/* Avatar with fetched image */}
            <Avatar src={employeeImage || undefined} alt="Employee Image" />
            <Typography style={{ color: 'black', marginLeft: 8, cursor: 'pointer' }} onClick={handleMenuOpen}>
              Hi, {employeeFirstName}
            </Typography>
            <IconButton onClick={handleMenuOpen} style={{ marginLeft: 8 }}>
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
          {renderMenu}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
