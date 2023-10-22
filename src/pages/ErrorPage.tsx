import ErrorImg from '../assets/error.jpg';
function ErrorPage() {
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
      <img src={ErrorImg} className='w-96 h-96' alt='error-img' />
      <p className='text-lg'>
        Something went wrong. Please reload website to continue. Error.
      </p>
      <button className='btn-blue mt-2' onClick={handleReload}>
        Reload
      </button>
    </div>
  );
}

export default ErrorPage;
