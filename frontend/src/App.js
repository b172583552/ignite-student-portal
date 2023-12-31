import {
    DesktopOutlined, DownloadOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Avatar, Badge, Breadcrumb, Button, Layout, Menu, Popconfirm, Table, Tag, Radio} from 'antd';
import React, { useState, useEffect } from 'react';
import {deleteStudent, getAllStudents} from "./client";
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";


const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];
const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [students, setStudents] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [fetching, setFetching] = useState(true);

    const TheAvatar = ({name}) =>{
        if (name.trim().length === 0){
            return <Avatar icon={<UserOutlined/>}/>
        }
        if (name.trim().split(" ").length === 1){
            return <Avatar>{name.charAt(0)}</Avatar>
        }

        return <Avatar>
                {name.charAt(0)}{name.charAt(name.length-1)}
                </Avatar>
    }
    const removeStudent = (studentId, callback) => {
        deleteStudent(studentId).then( () => {
            successNotification("Student deleted", `Student with id: ${studentId} is deleted`)
            callback()
        }).catch(err => {
            console.log(err.response)
            err.response.json().then(res => {
                console.log(res);
                errorNotification("There was an issue",
                    `${res.message}[${res.status}] [${res.error}]`)

            })
        })
    }
    const columns = fetchStudents => [
        {
            title: "",
            dataIndex: "avatar",
            key: "avatar",
            render: (text, student) => {
                return <TheAvatar name={student.name}/>
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Actions',
            key:'actions',
            render: (text, student) =>
                <Radio.Group>
                <Popconfirm placement={"topRight"}
                            title={`Are you sure to delete ${student.name}`}
                            onConfirm={() => removeStudent(student.id, fetchStudents)}
                            okText={'yes'}
                            cancelText={'No'}>
                            <Radio.Button value={'small'}>Delete</Radio.Button>
                </Popconfirm>
                    <Radio.Button value={'small'}>Edit</Radio.Button>
            </Radio.Group>



        }
    ];
    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);

            }).catch(err => {
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("There was an issue",
                        `${res.message}[${res.status}] [${res.error}]`,
                        "bottomLeft")
                })
            }).finally(() =>  setFetching(false) )

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = students => {
        if (students.length <= 0){
            return <>
                <Button type={"primary"} shape={"round"} icon={<DownloadOutlined/>} size={"large"} onClick={()=>setShowDrawer(!showDrawer)}>
                    ADD STUDENT
                </Button>
                <StudentDrawerForm showDrawer={showDrawer} setShowDrawer={setShowDrawer} fetchStudents={fetchStudents}/>
                <br/>
                <>no data available</>
            </>
        }

        return <>
            <StudentDrawerForm showDrawer={showDrawer} setShowDrawer={setShowDrawer} fetchStudents={fetchStudents}/>
            <Table
            dataSource={students}
            columns={columns(fetchStudents)}
            bordered
            title={()=>
                <>
                    <>
                    <Tag>No of students</Tag>
                    <Badge count={students.length} className={"site-badge-count-4"} />
                    </>

                    <br/>
                    <Button type={"primary"} shape={"round"} icon={<DownloadOutlined/>} size={"large"} onClick={()=>setShowDrawer(!showDrawer)}>
                        ADD STUDENT
                    </Button>

                </>}
            pagination={{ pageSize: 50 }} scroll={{ y: 240 }}
            rowKey={(student) => student.id}
        />;
            </>
    }


    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 360,
                        }}>
                        {renderStudents(students)}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    By Tom Wong
                </Footer>
            </Layout>
        </Layout>
    );
};
export default App;