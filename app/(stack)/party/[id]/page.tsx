export default async function PartyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return <div>page - {id}</div>;
}
