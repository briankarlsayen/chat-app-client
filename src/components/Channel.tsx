export default function Channel({ label, displayChannelDetails }: any) {
  const num = displayChannelDetails(label)?.unread;
  return (
    <div className='sidebar-item flex justify-between'>
      <p>{label}</p>
      <p>{num > 0 ? num : undefined}</p>
    </div>
  );
}
