import { api } from '../api.js';

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateSubscription = async (plan) => {
  try {
    const res = await api.post('/subscription/create-order', { plan: plan.toUpperCase() });
    
    // Accessing .data because we've updated the backend to use ApiResponse
    const order = res.data;

    if (!order || !order.id) {
      throw new Error("Failed to get valid order ID from server");
    }

    const options = {
      key: localStorage.getItem('RAZORPAY_KEY_ID') || 'rzp_test_SKkcEKrMnhlzOF',
      amount: order.amount,
      currency: order.currency,
      name: 'ResumeAI',
      description: `${plan} Plan Upgrade`,
      order_id: order.id,
      image: 'https://cdn-icons-png.flaticon.com/512/3208/3208112.png',
      handler: async function (response) {
        try {
          // Call backend to verify and update plan immediately
          await api.post('/subscription/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan: plan
          });

          alert('Payment Successful! 🚀\n\nYour account has been upgraded to Pro. Enjoy unlimited uploads!');
          window.location.hash = '#profile';
          window.location.reload();
        } catch (err) {
          console.error('Verification failed:', err);
          alert('Payment was successful but we couldn\'t update your plan automatically. Please contact support or refresh.');
        }
      },
      prefill: {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || '',
        contact: '', 
      },
      notes: {
        plan_selected: plan,
        userId: localStorage.getItem('userId'),
      },
      theme: {
        color: '#00d9ff',
      },
      modal: {
        ondismiss: function() {
          console.log('Checkout closed');
        },
        backdropclose: true
      }
    };

    const rzp = new window.Razorpay(options);
    
    // Add event listeners for better UX
    rzp.on('payment.failed', function (response) {
      console.error('Payment Failed:', response.error);
      alert('Payment Failed: ' + response.error.description);
    });

    rzp.open();
  } catch (err) {
    console.error('Subscription failed:', err);
    alert('Failed to initiate subscription: ' + err.message);
  }
};
