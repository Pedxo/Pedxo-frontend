import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import useUploadSignature from "../../features/contracts/useUploadSignature";
import Button from "../Button";
import CustomForm from "../../ui/CustomForm";

const FormFive = ({ nextStep }) => {
  const { uploadSignature, sendingForm } = useUploadSignature();
  const validationSchema = Yup.object({
    signature: Yup.mixed().required("Signature is required"),
  });
  const formik = useFormik({
    validationSchema,
    initialValues: {
      signature: null,
    },
    onSubmit: (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append("signature", values?.signature);
      uploadSignature(formData, {
        onSuccess: () => {
            nextStep()
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });
  const sigCanvas = useRef(null);
  const saveSignature = () => {
    const canvas = sigCanvas.current.getCanvas(); // Get the raw canvas element
    canvas.toBlob((blob) => {
      const signatureFile = new File([blob], "signature.png", { type: "image/png" });
      formik.setFieldValue("signature", signatureFile);
    }, "image/png");
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  return (
    <div className="overflow-hidden">
      <div className="text-lg font-semibold leading-normal mb-6 xl:text-2xl xl:mb-[32px]">
        Sign Signature
      </div>
      <div className="bg-gray-50 h-[202px]">
        <SignatureCanvas
          ref={sigCanvas}
          onBegin={() => {
            console.log("started")

          }}
          onEnd={() => {
            saveSignature()
            console.log("ended")
          }}
          canvasProps={{
            color: "white",
            className: "mx-auto",
            width: 400,
            height: 202,
          }}
        />

        <div className="flex justify-end my-4">
          <button onClick={clearSignature}>Clear</button>
        </div>
      </div>
      <CustomForm onSubmit={formik.handleSubmit}>
        <div className="mt-[50px] xl:mb-[66px] lg:flex lg:justify-center">
          {/* <button
          type="submit"
          onClick={saveSignature}
          className="flex items-center justify-center gap-2 pr-bg-clr w-full rounded-lg text-white text-[0.75rem] py-[14px] lg:w-auto lg:mx-auto lg:px-[60px] xl:py-6 xl:text-xl "
        >
          Use signature
          <img src={usesignature} alt="tick" />
        </button> */}
          <div>
            <Button
              buttonType="submit"
              disabled={formik.isSubmitting || sendingForm || !formik.isValid || !formik.dirty}
              // onClick={saveSignature}
              isLoading={sendingForm}
              type="primary"
            >
              Use Signature
            </Button>
          </div>
        </div>
      </CustomForm>
    </div>
  );
};
export default FormFive;
