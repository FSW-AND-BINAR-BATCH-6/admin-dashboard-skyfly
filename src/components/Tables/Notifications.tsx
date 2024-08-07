import axios from 'axios';
import { BsFillPencilFill, BsFillTrash3Fill, BsEye } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';
import Loader from '../../common/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Paginate from 'react-paginate';

const API_BASE_URL =
  'https://backend-skyfly-c1.vercel.app/api/v1/notifications';

const deleteNotification = async (id: string, onCompleted: Function) => {
  let isLogin: any = getCookie('isLogin') || false;
  let userLoggedIn = JSON.parse(isLogin);
  let token = userLoggedIn.token;
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  toast.success('Notification deleted successfully');
  onCompleted();
};

const updateNotification = async (e, onCompleted: Function) => {
  e.preventDefault();
  const { id, type, notificationsTitle, notificationsContent } =
    e.target.elements;

  const data = {
    type: type.value,
    title: notificationsTitle.value,
    content: notificationsContent.value,
  };

  let isLogin: any = getCookie('isLogin') || false;
  let userLoggedIn = JSON.parse(isLogin);
  let token = userLoggedIn.token;
  await axios.put(`${API_BASE_URL}/${id.value}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  toast.success('Notification updated successfully');
  onCompleted();
};

const NotificationRow = ({ notification, onRefresh }) => {
  const handleDelete = () => deleteNotification(notification.id, onRefresh);
  const handleUpdate = (e) => updateNotification(e, onRefresh);

  return (
    <tr>
      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
        <h5 className="font-medium text-black dark:text-white">
          {notification.type}
        </h5>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">
          {notification.notificationsTitle}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">
          {notification.notificationsContent}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">{notification.date}</p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <div className="flex items-center space-x-3.5">
          <ActionIcon
            icon={BsEye}
            title="detail"
            modalId={`detail_modal-${notification.id}`}
          />
          <ActionIcon
            icon={BsFillTrash3Fill}
            title="delete"
            modalId={`delete_modal-${notification.id}`}
          />
          <ActionIcon
            icon={BsFillPencilFill}
            title="edit"
            modalId={`edit_modal-${notification.id}`}
          />
          <NotificationDetailModal notification={notification} />
          <DeleteModal notification={notification} onDelete={handleDelete} />
          <EditModal notification={notification} onUpdate={handleUpdate} />
        </div>
      </td>
    </tr>
  );
};

const ActionIcon = ({ icon: Icon, title, modalId }) => (
  <button
    className="hover:text-primary"
    title={title}
    onClick={() => document.getElementById(modalId).showModal()}
  >
    <Icon />
  </button>
);

const NotificationDetailModal = ({ notification }) => (
  <dialog id={`detail_modal-${notification.id}`} className="modal">
    <div className="modal-box bg-white dark:bg-boxdark">
      <h3 className="font-bold text-lg text-light">Detail</h3>
      <div className="chat chat-start">
        <div className="chat-bubble">Notification detail</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble text-start">
          Notification type is <strong>{notification.type}</strong>
          <br />
          Notification title is{' '}
          <strong>{notification.notificationsTitle}</strong>
          <br />
          Notification content is{' '}
          <strong>{notification.notificationsContent}</strong>
          <br />
          Date is {notification.date}
          <br />
        </div>
      </div>
      <div className="modal-action">
        <button
          className="btn btn-ghost dark:bg-boxdark"
          onClick={() =>
            document.getElementById(`detail_modal-${notification.id}`).close()
          }
        >
          Close
        </button>
      </div>
    </div>
  </dialog>
);

const DeleteModal = ({ notification, onDelete }) => (
  <dialog id={`delete_modal-${notification.id}`} className="modal">
    <div className="modal-box bg-white dark:bg-boxdark">
      <h3 className="font-bold text-lg">Delete</h3>
      <p className="py-4">
        Are you sure you want to delete '{notification.notificationsTitle}'?
      </p>
      <div className="modal-action justify-between">
        <button className="btn btn-error" onClick={onDelete}>
          Yes, Delete it
        </button>
        <button
          className="btn btn-ghost"
          onClick={() =>
            document.getElementById(`delete_modal-${notification.id}`).close()
          }
        >
          Close
        </button>
      </div>
    </div>
  </dialog>
);

const EditModal = ({ notification, onUpdate }) => (
  <dialog id={`edit_modal-${notification.id}`} className="modal">
    <div className="modal-box bg-white dark:bg-boxdark">
      <h3 className="font-bold text-lg">Update</h3>
      <div className="py-4">
        <form onSubmit={onUpdate}>
          <input type="hidden" name="id" defaultValue={notification.id} />
          <FormField name="type" defaultValue={notification.type} />
          <FormField
            name="notificationsTitle"
            defaultValue={notification.notificationsTitle}
          />
          <FormField
            name="notificationsContent"
            defaultValue={notification.notificationsContent}
          />
          <FormField
            name="date"
            defaultValue={notification.date}
            readOnly={true}
          />
          <input
            type="submit"
            defaultValue="Update"
            className="btn bg-white dark:bg-black w-full my-3"
          />
        </form>
      </div>
      <div className="modal-action">
        <button
          className="btn btn-ghost"
          onClick={() =>
            document.getElementById(`edit_modal-${notification.id}`).close()
          }
        >
          Close
        </button>
      </div>
    </div>
  </dialog>
);

const FormField = ({ name, value, readOnly }) => (
  <label className="input input-bordered flex items-center gap-2 my-2 bg-white dark:bg-boxdark">
    <input
      type="text"
      className="grow"
      placeholder={name}
      name={name}
      defaultValue={value}
      readOnly={readOnly}
    />
  </label>
);

const TableNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [rows, setRows] = useState<number>(0);

  const changePage = ({ selected }) => {
    setPage(selected + 1);
  };

  const fetchData = async () => {
    let isLogin: any = getCookie('isLogin') || false;
    let userLoggedIn = JSON.parse(isLogin);
    let token = userLoggedIn.token;
    try {
      const response = await axios.get(
        `${API_BASE_URL}?limit=${limit}&page=${page}&sort=asc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const sortedData = response.data.data.sort((a: any, b: any) => {
        return new Date(a.date) - new Date(b.date);
      });
      setNotifications(sortedData);
      setRows(response.data.totalItems);
      setPage(response.data.pagination.currentPage);
      setPages(response.data.pagination.totalPage);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh, page]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Type
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Notification Title
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Notification Content
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Date
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onRefresh={() => {
                  setRefresh(!refresh);
                  navigate(0);
                }}
              />
            ))}
          </tbody>
        </table>
        <p className="mt-3">
          Total Data: {rows} Page: {rows ? page : 0} of {pages}
        </p>
        <nav
          className="pagination is-centered"
          role="navigation"
          key={rows}
          aria-label="pagination"
        >
          <Paginate
            previousLabel={'< Prev'}
            nextLabel={'Next >'}
            pageCount={pages}
            onPageChange={changePage}
            containerClassName="join"
            pageLinkClassName="join-item btn mx-1"
            activeClassName="btn btn-active"
            previousLinkClassName="btn"
            nextLinkClassName="btn"
            disabledLinkClassName="btn btn-disabled"
          />
        </nav>
      </div>
    </div>
  );
};

export default TableNotifications;
