// src/features/contracts/useUploadSignature.js
import { useMutation } from "@tanstack/react-query";
import { postSignature } from "../../services/apiContract";

export default function useUploadSignature() {
  const { mutate: uploadSignature, isPending: sendingForm } = useMutation({
    mutationKey: ["signature"],
    mutationFn: (signature) => postSignature(signature),
  });

  return {
    uploadSignature,
    sendingForm,
  };
}
