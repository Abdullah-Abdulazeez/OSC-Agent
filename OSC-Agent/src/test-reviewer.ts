import { CodeReviewer } from './agents/code-reviewer';

async function manualTest() {
  const reviewer = new CodeReviewer();

  console.log('🚀 Testing Code Reviewer Agent...');

  const issue = 'The application crashes when the user profile is missing an email field.';
  const fix = `
    export function getEmail(user) {
      // Intentional bug: no check for 'user' or 'user.email'
      return user.email.toLowerCase();
    }
  `;

  try {
    const feedback = await reviewer.reviewFix(issue, fix);
    console.log('✅ AI Review Result:');
    console.log(JSON.stringify(feedback, null, 2));
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

manualTest();
