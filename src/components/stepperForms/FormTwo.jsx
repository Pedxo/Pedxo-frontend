import { Switch } from 'antd';
import { useState, useEffect } from 'react';
import Dropdown from '../../Dropdown.json';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomForm from '../../ui/CustomForm';
import CustomSelect from '../../ui/CustomSelect';
import Button from '../Button';
import useJobDetailsForm from '../../features/contracts/useJobDetailsForm';
import { useSearchParams } from 'react-router-dom';
import { formatISO } from 'date-fns';

const FormTwo = ({ nextStep, savedState, username, userId }) => {
  const [searchParams] = useSearchParams();
  const contractType = searchParams.get('contractType') || null;
  const { updateForm, sendingForm } = useJobDetailsForm();
  const today = new Date().toISOString().split('T')[0];

  const [showSwitch, setShowSwitch] = useState(Boolean(savedState?.endDate) || false);
  const [settingTemplate, setSettingTemplate] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const validationSchema = Yup.object({
    roleTitle: contractType === 'gig-based'
      ? Yup.string().required('Role title is required')
      : Yup.string().notRequired(),
    seniorityLevel: Yup.string().notRequired(),
    scopeOfWork: Yup.string().notRequired(),
    startDate: Yup.string().required('Start Date is required'),
    endDate: contractType === 'gig-based'
      ? Yup.string().required('End Date is required')
      : Yup.string().notRequired(),
    explanationOfScopeOfWork: Yup.string().notRequired(),
  });

  const initialValues = {
    roleTitle: savedState?.roleTitle || '',
    seniorityLevel: savedState?.seniorityLevel || '',
    scopeOfWork: savedState?.scopeOfWork || '',
    startDate: savedState?.startDate
      ? formatISO(new Date(savedState.startDate), { representation: 'date' })
      : '',
    endDate: savedState?.endDate
      ? formatISO(new Date(savedState.endDate), { representation: 'date' })
      : '',
    explanationOfScopeOfWork: savedState?.explanationOfScopeOfWork || '',
  };

  const formik = useFormik({
    validationSchema,
    initialValues,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      const mergedData = {
        ...(JSON.parse(localStorage.getItem(`${username}_personalInfo`)) || {}),
        ...values,
      };

      localStorage.setItem(`${username}_personalInfo`, JSON.stringify(mergedData));

      if (!hasChanges) {
        nextStep();
        setSubmitting(false);
        return;
      }

      const payload = {
        ...values,
        userId, //  Include userId for backend filtering
      };

      updateForm(payload, {
        onSuccess: () => {
          nextStep();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });

  useEffect(() => {
    const changesDetected = Object.keys(initialValues).some(
      (key) => formik.values[key] !== initialValues[key]
    );
    setHasChanges(changesDetected);
  }, [formik.values, initialValues]);

  const handleSow = (e) => {
    formik.setFieldValue('scopeOfWork', e.target.value);
    handleSetTemplate(e.target.value);
  };

  const handleSetTemplate = (name) => {
    if (!name) return;
    setSettingTemplate(true);
    const selected = Dropdown.scopeOfWork.explanation.find((el) => el.title === name);
    if (selected) {
      const responsibilitiesText = selected.responsibilities
        .map((item) => `- ${item}`)
        .join('\n');
      formik.setFieldValue('explanationOfScopeOfWork', responsibilitiesText);
    }
    setSettingTemplate(false);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-1'>
        <h1 className='text-lg font-semibold leading-normal'>Role Details</h1>
        <div className='text-sm font-medium leading-normal text-gray-500'>
          {contractType === 'full-time' ? 'Full Time Role' : 'Gig Based Role'}
        </div>
      </div>

      <CustomForm onSubmit={formik.handleSubmit}>
        <CustomSelect
          label={`Role Title${contractType === 'gig-based' ? ' *' : ''}`}
          name='roleTitle'
          onBlur={formik.handleBlur}
          value={formik.values.roleTitle}
          placeholder='Select Role Title...'
          onChange={formik.handleChange}
          options={Dropdown.roleTitle}
        />

        <CustomSelect
          label='Seniority Level'
          name='seniorityLevel'
          onBlur={formik.handleBlur}
          value={formik.values.seniorityLevel}
          onChange={formik.handleChange}
          placeholder='Select seniority level...'
          options={Dropdown.seniorityLevels}
        />

        <CustomSelect
          label='Scope of work template'
          name='scopeOfWork'
          onBlur={formik.handleBlur}
          onChange={handleSow}
          value={settingTemplate ? 'Setting template...' : formik.values.scopeOfWork}
          placeholder={settingTemplate ? 'Setting Template...' : 'Choose template...'}
          disabled={settingTemplate}
          options={Dropdown.scopeOfWork.options}
        />

        {/* Start Date */}
        <div className='relative flex flex-col gap-1 w-full md:gap-3'>
          <div className='flex justify-between'>
            <label htmlFor='startDate' className='text-sm font-semibold leading-normal'>
              Start Date<span className='text-red-500'>*</span>
            </label>
          </div>
          <input
            type='date'
            name='startDate'
            id='startDate'
            onClick={(e) => e.target.showPicker()}
            onBlur={formik.handleBlur}
            value={formik.values.startDate}
            onChange={formik.handleChange}
            min={today}
            className='w-full bg-transparent border outline-gray-400 rounded-lg p-3 text-sm'
            style={{ borderColor: 'rgba(0, 0, 0, 0.20)' }}
          />
        </div>

        {/* End Date */}
        <div className='relative flex flex-col gap-1 md:gap-3 w-full text-sm'>
          <div className='flex justify-between'>
            <label
              htmlFor='endDate'
              className={`font-semibold leading-normal ${!showSwitch && 'opacity-40'}`}
            >
              End Date
            </label>
            {contractType === 'full-time' && (
              <Switch
                size='small'
                checked={showSwitch}
                onChange={() => setShowSwitch(!showSwitch)}
              />
            )}
          </div>
          <input
            type='date'
            name='endDate'
            id='endDate'
            disabled={contractType === 'full-time' && !showSwitch}
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onClick={(e) => e.target.showPicker()}
            min={formik.values.startDate}
            className='w-full disabled:opacity-50 bg-transparent border outline-gray-400 rounded-lg p-4'
            style={{ borderColor: 'rgba(0, 0, 0, 0.20)' }}
          />
        </div>

        {/* Scope Explanation */}
        <div className='flex flex-col gap-1 w-full md:gap-3 text-sm'>
          <label htmlFor='scope of work' className='font-semibold leading-normal'>
            Scope of explanation and tech stack requirements
          </label>
          <textarea
            name='explanationOfScopeOfWork'
            onBlur={formik.handleBlur}
            id='scope of work'
            rows='7'
            value={formik.values.explanationOfScopeOfWork}
            onChange={formik.handleChange}
            className='bg-transparent border outline-gray-400 rounded-lg px-4 py-2 caret-black font-medium focus:ring-2 focus:ring-blue-500'
            style={{ borderColor: 'rgba(0, 0, 0, 0.20)' }}
          ></textarea>
          <p className='text-xs text-gray-500 italic mt-1'>
            You can edit the generated scope of work. Just click and start typing.
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            isLoading={formik.isSubmitting || sendingForm}
            type='primary'
            buttonType='submit'
            disabled={!formik.isValid || formik.isSubmitting}
            size='large'
          >
            {hasChanges ? 'Save and Continue' : 'Continue'}
          </Button>
        </div>
      </CustomForm>
    </div>
  );
};

export default FormTwo;