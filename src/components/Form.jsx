import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const StyledForm = styled.form`
  @media (max-width: 576px) {
    width: unset;
    padding: 1rem 2rem;
  }
  width: 400px;
  padding: 2rem 3rem;
`;

const FormButtons = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const SubmitButton = styled.button`
  flex: 1;
  border: none;
  background-color: #234c6a;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const CancelButton = styled.button`
  flex: 1;
  border: none;
  background-color: #88304e;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const ErrorMsg = styled.div`
  color: #8a0000;
`;

const CfTurnstile = styled.div``;

function Form({ onCloseModal }) {
  const [isLoadaing, setIsLoadding] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      cf_turnstile_token: '',
    },
  });

  // registering the virtual field
  useEffect(() => {
    register('cf_turnstile_token', { required: true });
  }, [register]);

  const onTurnstileSuccess = (token) => {
    setValue('cf_turnstile_token', token, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (!window.turnstile) return;

    window.turnstile.render('.cf-turnstile', {
      sitekey: '0x4AAAAAADBJP2XuSxoWqQFB',
      callback: onTurnstileSuccess,
    });
  }, []);

  async function onSubmit(data) {
    console.log('submitting data: ', data);
    try {
      setIsLoadding(true);
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // if there are too many requests, redirect

      if (res.status === 429) {
        sessionStorage.setItem('tooManyRequests', 'true');
        navigate('/too-many-requests');
      }

      const result = await res.json();

      setIsLoadding(false);

      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong');
      }
      // set a sessionStorage for having fiiled out the form
      sessionStorage.setItem('formFilledOut', 'true');

      reset();
      navigate('/thank-you');
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <StyledForm
      type={onCloseModal ? 'modal' : 'regular'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-4">
        <label htmlFor="name" className="form-lable">
          Nume
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          {...register('name', { required: 'Numele este obligatoriu!' })}
        />
        {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="form-label">
          Număr de telefon
        </label>
        <input
          type="text"
          name="phone"
          className="form-control"
          {...register('phone', {
            required: 'Numarul de telefon este obligatoriu!',
          })}
        />
        {errors.phone && <ErrorMsg>{errors.phone.message}</ErrorMsg>}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="form-label">
          Adresă de email
        </label>
        <input
          type="text"
          name="email"
          className="form-control"
          {...register('email', { required: 'Email-ul este obligatoriu!' })}
        />
        {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="form-label">
          Mesaj (Opțional)
        </label>
        <textarea
          type="text"
          rows={3}
          name="message"
          className="form-control"
          {...register('message')}
        />
      </div>
      {/* Turnstile Widget */}
      <div className="mb-2 d-flex justify-content-center">
        <CfTurnstile
          className="cf-turnstile"
          data-theme="light"
          data-size="normal"
        ></CfTurnstile>
      </div>
      <FormButtons>
        <SubmitButton type="submit">
          {isLoadaing ? (
            <>
              <LoadingSpinner /> Se trimite...
            </>
          ) : (
            'Trimite'
          )}
        </SubmitButton>
        <CancelButton onClick={() => onCloseModal?.()}>Anulează</CancelButton>
      </FormButtons>
    </StyledForm>
  );
}

export default Form;
