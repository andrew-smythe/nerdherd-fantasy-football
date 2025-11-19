'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormControl, Grid, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function MatchupOptions({
    year,
    minYear,
    maxYear,
}) {

    const arrayYears = Array.from({ length: (maxYear + 1 - minYear) }, (_, i) => minYear + i);

    const router = useRouter();
    const handleYearChange = (event: SelectChangeEvent) => {
        router.push('/matchups/' + event.target.value);
    }

    return (
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
    );
}