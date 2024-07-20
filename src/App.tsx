import  {useState, useRef} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import calcImage from "../public/images/icon-calculator.svg";
import resultImage from "../public/images/illustration-empty.svg";
import "./reset.css";
import './App.css';

function App() {
  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
  });

  // Create a ref for Formik
  const formikRef = useRef(null);

  const MortgageSchema = Yup.object().shape({
    mortgageAmount: Yup.number()
      .required('This field is required')
      .typeError('Must be a number'),
    mortgageTerm: Yup.number()
      .required('This field is required')
      .typeError('Must be a number'),
    interestRate: Yup.number()
      .required('This field is required')
      .typeError('Must be a number'),
    mortgageType: Yup.string().required('This field is required'),
  });

  const calculateRepayments = (values:any) => {
    const {mortgageAmount, mortgageTerm, interestRate, mortgageType} = values;
    const principal = parseFloat(mortgageAmount);
    const annualInterestRate = parseFloat(interestRate) / 100;
    const numberOfPayments = parseInt(mortgageTerm) * 12;

    if (isNaN(principal) || isNaN(annualInterestRate) || isNaN(numberOfPayments) || numberOfPayments === 0) {
      return {
        monthlyPayment: 0,
        totalPayment: 0,
      };
    }

    const monthlyInterestRate = annualInterestRate / 12;
    let monthlyPayment;

    if (mortgageType === 'Repayment') {
      monthlyPayment = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = principal * monthlyInterestRate;
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
    };
  };

  return (
    <div className='app'>
      <div className="app-wrapper">
        <div className="calculator">
          <div className="app-header">
            <h1>Mortgage Calculator</h1>
            <button onClick={() => {
              // Reset the form values and clear the results
              if (formikRef.current) {
                // @ts-ignore
                formikRef.current?.resetForm();
              }
              setResults({monthlyPayment: 0, totalPayment: 0});
            }}>Clear All
            </button>
          </div>
          <div className="app-content">
            <Formik
              innerRef={formikRef} // Attach ref to Formik
              initialValues={{
                mortgageAmount: '',
                mortgageTerm: '',
                interestRate: '',
                mortgageType: '',
              }}
              validationSchema={MortgageSchema}
              onSubmit={(values, {setSubmitting}) => {
                const {monthlyPayment, totalPayment} = calculateRepayments(values);
                setResults({...results, monthlyPayment, totalPayment});
                setSubmitting(false);
              }}
            >
              {({isSubmitting, errors, touched, values}) => (
                <Form className='form'>
                  <div
                    className={`input-wrapper input-mortgage-amount ${errors.mortgageAmount && touched.mortgageAmount ? 'error' : ''}`}>
                    <label htmlFor="mortgageAmount">Mortgage Amount</label>
                    <Field name="mortgageAmount" type="text"/>
                    <ErrorMessage className='error' name="mortgageAmount" component="span"/>
                  </div>
                  <div
                    className={`input-wrapper input-mortgage-term ${errors.mortgageTerm && touched.mortgageTerm ? 'error' : ''}`}>
                    <label htmlFor="mortgageTerm">Mortgage Term</label>
                    <Field name="mortgageTerm" type="text"/>
                    <ErrorMessage className='error' name="mortgageTerm" component="span"/>
                  </div>
                  <div
                    className={`input-wrapper input-interest-rate ${errors.interestRate && touched.interestRate ? 'error' : ''}`}>
                    <label htmlFor="interestRate">Interest Rate</label>
                    <Field name="interestRate" type="text"/>
                    <ErrorMessage className='error' name="interestRate" component="span"/>
                  </div>

                  <div className={`input-wrapper`}>
                    <label>Mortgage Type</label>
                    <div className='radio-wrapper'>
                      <label className={values.mortgageType === 'Repayment' ? 'selected' : ''}>
                        <Field type="radio" name="mortgageType" value="Repayment"/>
                        Repayment
                      </label>
                      <label className={values.mortgageType === 'Interest Only' ? 'selected' : ''}>
                        <Field type="radio" name="mortgageType" value="Interest Only"/>
                        Interest Only
                      </label>
                    </div>
                    <ErrorMessage className='error' name="mortgageType" component="span"/>
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    <img src={calcImage} alt="calc Image"/>
                    Calculate Repayments
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {results.monthlyPayment ? (
          <div className="results">
            <h2>Your results</h2>
            <p>Your results are shown below based on the information you provided.To adjust the results, edit the form
              and click “calculate repayments” again.</p>
            <div className="box">
              <div className="box-row">
                <p>Your monthly repayments</p>
                <p className='monthly-value'>£ {results.monthlyPayment}</p>
              </div>
              <div className="box-row">
                <p>Total you'll repay over the term</p>
                <p className='total-value'>{results.totalPayment}</p>
              </div>
            </div>

          </div>
        ) : (
          <div className="results empty">
            <img src={resultImage} alt="result image"/>
            <h2>Results shown here</h2>
            <p>Complete the form and click “calculate repayments” to see what your monthly repayments would be.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
