import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next';
import { Button, Group } from "@mantine/core";

import {Layout} from '../../../layouts'

ProfilePage.getLayout = function getLayout(page: any) {
  return <Layout variant={'user'}>{page}</Layout>
}

export default function ProfilePage() {
  return (
    // <Group mt={50} position="apart">
      <Button size="xl">Profile</Button>
    // </Group>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('user session')
  console.log(session)

  if (!session || session.user.user_metadata.accountType !== 'Patient')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}
// IndexPage.requireAuth = true;
// export const getServerSideProps = withPageAuthRequired()