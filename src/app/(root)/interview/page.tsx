import Agent from "@/components/Agent";

const Page = () => {
  return (
    <>
        <h3>Interview Generation</h3>

        <Agent 
            userName="AI Interviewer"
            userId="interviewer"
            type="generate"
        />
    </>
  )
};

export default Page;
