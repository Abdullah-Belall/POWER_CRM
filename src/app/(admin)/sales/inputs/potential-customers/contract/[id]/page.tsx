import ConfirmSignedContractPage from "@/components/form/customers/confirm-signed-contract";

export default async function ConfirmSignedContract({ params }: { params: Promise<{id: string}> }) {
  const contract_id = (await params).id
  return <ConfirmSignedContractPage contract_id={contract_id} />
}