
import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';

interface RestrictionAddModalProps {
  open: boolean;
  onClose: () => void;
  onRestrictionAdded: () => void;
}

const RestrictionAddModal: React.FC<RestrictionAddModalProps> = ({ open, onClose, onRestrictionAdded }) => {
  const [date, setDate] = useState<string>('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  
  const availableTimes = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSave = async () => {
    try {
      await axiosInstance.post('/restaurant/add-restricted-time-slots', {
        date,
        times: selectedTimes,
      });
      toast.success('Restriction added successfully!');
      onRestrictionAdded();
      onClose();
    } catch (error) {
      toast.error('Failed to add restriction. Please try again.');
      console.error(error);
    }
  };

  const toggleTimeSelection = (time: string) => {
    setSelectedTimes(prevTimes =>
      prevTimes.includes(time)
        ? prevTimes.filter(t => t !== time)
        : [...prevTimes, time]
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Add Time Slot Restriction
        </Typography>
        <TextField
          fullWidth
          label="Select Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />
        <Typography variant="body1" mb={1}>
          Select Time Slots
        </Typography>
        <Grid container spacing={2}>
          {availableTimes.map((time) => (
            <Grid item xs={4} key={time}>
              <Button
                variant={selectedTimes.includes(time) ? 'contained' : 'outlined'}
                color={selectedTimes.includes(time) ? 'primary' : 'inherit'}
                fullWidth
                onClick={() => toggleTimeSelection(time)}
              >
                {time}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Restriction
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RestrictionAddModal;

