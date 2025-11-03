import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';

export default function ListButtonLink(props: { icon: React.ReactElement<unknown>, text: string, to: string }) {
    return (
        <ListItemButton component={Link} href={props.to}>
            {props.icon ? <ListItemIcon>{props.icon}</ListItemIcon> : null}
            <ListItemText primary={props.text} />
        </ListItemButton>
    );
}