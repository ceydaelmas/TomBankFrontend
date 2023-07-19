import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';

interface ITemporaryDrawerProps {
    state: {
      left: boolean;
    };
    setState: React.Dispatch<React.SetStateAction<{
      left: boolean;
    }>>;
    toggleDrawer: (
      anchor: Anchor,
      open: boolean
    ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  }
  

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function TemporaryDrawer({state, setState, toggleDrawer}: ITemporaryDrawerProps) {
  const navigate = useNavigate(); 
 
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Pages', 'AddPage'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(index === 0 ? '/' : '/add-pages')}> 
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}