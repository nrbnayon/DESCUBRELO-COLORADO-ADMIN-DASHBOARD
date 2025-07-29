import DashboardHeader from "../components/dashboard-header";
import ManagementPosts from "../components/Posts/ManagementPosts";

export default function ManagePostsPage() {
  return (
    <div>
      <DashboardHeader title="Welcome Nayon" />
      <div className="p-6">
        <ManagementPosts
          itemsPerPage={20}
          title="All Posts"
          buttonText="" // button not needed here
          pageUrl=""
        />
      </div>
    </div>
  );
}
