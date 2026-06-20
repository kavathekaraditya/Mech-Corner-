import React from 'react';
import { useAppState } from '../context/StateContext';
import { Icons } from './Icons';

export default function ToastContainer() {
  const { toasts } = useAppState();

  return (
    <div id="toast-container" className="toast-container">
      {toasts.map(toast => {
        let iconSVG = Icons.info;
        if (toast.type === 'success') iconSVG = Icons.check;
        if (toast.type === 'error') iconSVG = Icons.alert;

        return (
          <div key={toast.id} className={`toast ${toast.type} show`}>
            <div className="toast-icon">{iconSVG}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}
