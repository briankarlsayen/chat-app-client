import Lottie from 'lottie-react';
import paperPlane from '../assets/paper-plane.json';
interface ILoading {
  loading: boolean;
}

export default function Loading({ loading }: ILoading) {
  return (
    <div
      className={
        loading ? 'loading opacity-100 z-10' : 'loading opacity-0 z-0 invisible'
      }
    >
      <Lottie animationData={paperPlane} loop={true} />
      <h2>Please wait</h2>
      <p>We are making things ready for you.</p>
    </div>
  );
}
