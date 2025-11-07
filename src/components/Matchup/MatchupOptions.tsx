'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function MatchupOptions({
        userId,
        year,
        week,
        minYear,
        maxYear,
        numWeeks,
        users,
}) {

    const router = useRouter();
    const handleYearChange = (event: SelectChangeEvent) => {
        router.push('/matchup/' + userId + '/' + event.target.value + '/' + week);
    }
    const handleWeekChange = (event: SelectChangeEvent) => {
        router.push('/matchup/' + userId + '/' + year + '/' + event.target.value);
    }
    const handleUserChange = (event: SelectChangeEvent) => {
        router.push('/matchup/' + event.target.value + '/' + year + '/' + week);
    }

    const arrayYears = Array.from({ length: (maxYear + 1 - minYear) }, (_, i) => minYear + i);
    const arrayWeeks = Array.from({ length: (numWeeks + 1 - 1) }, (_, i) => 1 + i);

    return (
        <Grid container>
            <Grid size={{ xs: 4 }}>
                <FormControl variant="filled" sx={{ pr: 1, mb: 1, width: "100%" }}>
                    <InputLabel id="week-label">User</InputLabel>
                    <Select
                        labelId="week-label"
                        value={userId}
                        label="Week"
                        onChange={handleUserChange}
                    >
                        {
                            users.map(u => (
                                <MenuItem value={u.id}>{ u.name }</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 4 }}>
                <FormControl variant="filled" sx={{ pr: 1, mb: 1, width: "100%" }}>
                    <InputLabel id="year-label">Season</InputLabel>
                    <Select
                        labelId="year-label"
                        value={year}
                        label="Year"
                        onChange={handleYearChange}
                    >
                        {
                            arrayYears.map(ay => (
                                <MenuItem value={ay}>{ ay }</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 4 }}>
                <FormControl variant="filled" sx={{ mb: 1, width: "100%" }}>
                    <InputLabel id="week-label">Week</InputLabel>
                    <Select
                        labelId="week-label"
                        value={week}
                        label="Week"
                        onChange={handleWeekChange}
                    >
                        {
                            arrayWeeks.map(ay => (
                                <MenuItem value={ay}>{ ay }</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}