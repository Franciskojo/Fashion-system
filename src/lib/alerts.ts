import Swal, { SweetAlertOptions } from 'sweetalert2';
import { toast, ToastOptions } from 'react-toastify';

/**
 * Custom-styled SweetAlert instance matching StitchFlow fashion branding
 */
export const stitchSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl border border-purple-100 shadow-2xl font-sans',
    title: 'text-xl font-black text-gray-900',
    htmlContainer: 'text-xs text-gray-600 font-medium',
    confirmButton: 'px-5 py-2.5 bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-900 hover:to-pink-800 text-white font-bold rounded-xl text-xs shadow-md transition-all mx-1.5 cursor-pointer',
    cancelButton: 'px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all mx-1.5 cursor-pointer',
    denyButton: 'px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all mx-1.5 cursor-pointer',
  },
  buttonsStyling: false,
});

/**
 * Toast mixin for SweetAlert2 (corner floating notification)
 */
export const swalToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toastEl) => {
    toastEl.addEventListener('mouseenter', Swal.stopTimer);
    toastEl.addEventListener('mouseleave', Swal.resumeTimer);
  },
  customClass: {
    popup: 'rounded-2xl border border-purple-100 shadow-xl font-sans text-xs',
    title: 'text-xs font-bold text-gray-800',
  },
});

/**
 * Helper to display SweetAlert2 modal dialogs
 */
export const alertSuccess = (title: string, text?: string, options?: SweetAlertOptions) => {
  return stitchSwal.fire({
    icon: 'success',
    title,
    text,
    iconColor: '#9333ea', // purple-600
    confirmButtonText: 'Great, Continue',
    ...options,
  });
};

export const alertError = (title: string, text?: string, options?: SweetAlertOptions) => {
  return stitchSwal.fire({
    icon: 'error',
    title,
    text,
    iconColor: '#e11d48', // rose-600
    confirmButtonText: 'Understood',
    ...options,
  });
};

export const alertWarning = (title: string, text?: string, options?: SweetAlertOptions) => {
  return stitchSwal.fire({
    icon: 'warning',
    title,
    text,
    iconColor: '#d97706', // amber-600
    confirmButtonText: 'I understand',
    ...options,
  });
};

export const alertConfirm = async (options: {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: 'warning' | 'question' | 'info';
}): Promise<boolean> => {
  const res = await stitchSwal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || 'question',
    iconColor: '#9333ea',
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'Yes, Proceed',
    cancelButtonText: options.cancelText || 'Cancel',
    reverseButtons: true,
  });
  return res.isConfirmed;
};

/**
 * High-convenience Toastify helpers
 */
export const showToast = {
  success: (msg: string, opts?: ToastOptions) => toast.success(msg, { icon: () => '✨', ...opts }),
  error: (msg: string, opts?: ToastOptions) => toast.error(msg, { ...opts }),
  info: (msg: string, opts?: ToastOptions) => toast.info(msg, { ...opts }),
  warning: (msg: string, opts?: ToastOptions) => toast.warning(msg, { ...opts }),
};

export { Swal, toast };
