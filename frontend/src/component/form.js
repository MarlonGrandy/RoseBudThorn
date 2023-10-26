import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const TooltipComponent = ({ tooltipText }) => (
  <OverlayTrigger
    placement="right"
    overlay={<Tooltip id={`tooltip-right`}>{tooltipText}</Tooltip>}
  >
    <span style={{ marginLeft: '0.5rem', color: 'primary', cursor: 'pointer' }}>
      <FontAwesomeIcon icon={faInfoCircle} />
    </span>
  </OverlayTrigger>
);

const InputField = ({ label, register, tooltipText, ...rest }) => (
  <Form.Group style={{ marginBottom: '1rem' }}>
    <Form.Label>
      {label}
      {tooltipText && <TooltipComponent tooltipText={tooltipText} />}
    </Form.Label>
    <Form.Control {...register} {...rest} />
  </Form.Group>
);

const SelectField = ({ label, register, options, tooltipText, ...rest }) => (
  <Form.Group style={{ marginBottom: '1rem' }}>
    <Form.Label>
      {label}
      {tooltipText && <TooltipComponent tooltipText={tooltipText} />}
    </Form.Label>
    <Form.Select {...register} {...rest}>
      {options.map(option => <option key={option}>{option}</option>)}
    </Form.Select>
  </Form.Group>
);

const UserProfileForm = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setApiError('');
      data.userId = userId;
      await axios.put(`/api/user/update`, data);
      alert('Profile updated successfully');
      navigate("/userHome", { state: { userId } });
    } catch (error) {
      console.error(error.message);
      setApiError('Update failed, please try again');
    }
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '30rem', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Card.Title style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Profile</Card.Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputField label="First Name" tooltipText="Please provide your first name" register={register("first_name", { required: "First Name is required" })} />
          <InputField label="Last Name" tooltipText="Please provide your last name" register={register("last_name", { required: "Last Name is required" })} />
          <InputField label="Phone Number" tooltipText="Your contact number" register={register("phone_number", { required: "Phone number is required", pattern: { value: /^[0-9]+$/, message: "Invalid phone number" } })} />
          <InputField label="Age" tooltipText="Your age" register={register("age", { required: "Age is required", pattern: { value: /^[0-9]+$/, message: "Invalid age" } })} />
          <SelectField 
            label="Chat Style"
            tooltipText="Your preferred chat style"
            register={register("chat_style")}
            options={["Default", "Friendly", "Motivational", "Sarcastic", "Energetic", "Calm", "Philosophical"]}
          />
          {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
          <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default UserProfileForm;
