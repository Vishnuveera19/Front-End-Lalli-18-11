import React from 'react';
import { Grid, Typography } from '@mui/material';

const Calendar = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysInMonth = 31; // Adjust for the specific month

  const createCalendarGrid = () => {
    const grid = [];
    let day = 1;
    for (let week = 0; week < 6; week++) { // Assuming max 6 weeks in a month
      grid.push(<Grid container spacing={1} key={week}>
        {daysOfWeek.map((dayOfWeek, dayOfWeekIndex) => {
          if (day > daysInMonth) {
            return <Grid item key={dayOfWeekIndex}>
              <Typography variant="body1" align="center" />
            </Grid>;
          } else {
            return <Grid item key={dayOfWeekIndex}>
              <Typography variant="body1" align="center">
                {day}
              </Typography>
            </Grid>;
          }
        })}
      </Grid>);
      day += 7;
    }
    return grid;
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <Grid container justifyContent="space-around">
          {daysOfWeek.map((day, index) => (
            <Grid item key={index}>
              <Typography variant="subtitle1" align="center">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {createCalendarGrid()}
    </Grid>
  );
};

export default Calendar;