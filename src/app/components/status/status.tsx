import React from 'react';
import styles from './status.module.css'; // Component-scoped CSS
import { Pending } from '@mui/icons-material';

const StatusButton = ({ status }) => {
  const statusStyles = {
    Approved: styles.approved,
    Rejected: styles.rejected,
    Edited: styles.edited,
    Pending: styles.pending,
    Expired: styles.expired,
  };

  return (
    <span className={`${styles.statusButton} ${statusStyles[status] || ''}`}>
      {status}
    </span>
  );
};

export default StatusButton;
