import React, { useState } from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const logout = useAuthStore((state) => state.logout);
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		logout();
		handleClose();
		navigate('/login');
	};

	const handleNavigate = (path: string) => {
		navigate(path);
		handleClose();
	};

	return (
		<AppBar position='static'>
			<Toolbar>
				<Typography
					variant='h6'
					component={Link}
					to='/'
					sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
				>
					Task Manager
				</Typography>
				{isMobile ? (
					<>
						<IconButton
							size='large'
							edge='end'
							color='inherit'
							aria-label='menu'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleMenu}
							sx={{ ml: 2 }}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							{isAuthenticated
								? [
										<MenuItem
											key='tasks'
											onClick={() => handleNavigate('/')}
										>
											Tasks
										</MenuItem>,
										<MenuItem
											key='charts'
											onClick={() => handleNavigate('/charts')}
										>
											Charts
										</MenuItem>,
										<MenuItem
											key='logout'
											onClick={handleLogout}
										>
											Logout
										</MenuItem>,
									]
								: [
										<MenuItem
											key='login'
											onClick={() => handleNavigate('/login')}
										>
											Login
										</MenuItem>,
										<MenuItem
											key='register'
											onClick={() => handleNavigate('/register')}
										>
											Register
										</MenuItem>,
									]}
						</Menu>
					</>
				) : (
					<Box>
						{isAuthenticated ? (
							<>
								<Button
									color='inherit'
									component={Link}
									to='/'
								>
									Tasks
								</Button>
								<Button
									color='inherit'
									component={Link}
									to='/charts'
								>
									Charts
								</Button>
								<Button
									color='inherit'
									onClick={handleLogout}
								>
									Logout
								</Button>
							</>
						) : (
							<>
								<Button
									color='inherit'
									component={Link}
									to='/login'
								>
									Login
								</Button>
								<Button
									color='inherit'
									component={Link}
									to='/register'
								>
									Register
								</Button>
							</>
						)}
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
