import CreatorPage from "@/components/CreatorPage";

export default async function page({
  params,
}: {
  params: Promise<{ creatorId: string }>;
}) {
  // Wait for the params promise to resolve
  const { creatorId } = await params;

  return (
    <div>
      <CreatorPage creatorId={creatorId} />
    </div>
  );
}
