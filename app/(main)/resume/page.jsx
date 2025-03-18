import { getResume } from '@/actions/resume';
import ResumeBuilder from './_components/resume-builder';


const ResumePage = async () => {
    const resume = await getResume();
  return  <div>
     <ResumeBuilder initialContent={resume?.content} />
      
    </div>;
  
};

export default ResumePage;
