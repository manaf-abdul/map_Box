import { useState, useEffect, useContext } from 'react'
import { Menu } from 'antd'
import Link from 'next/link'
import { AppstoreAddOutlined, CarryOutOutlined, TeamOutlined, CoffeeOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

const { Item, SubMenu, ItemGroup } = Menu //Menu.Item

const TopNav = () => {
    const router = useRouter()
    const [current, setCurrent] = useState('')

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname)
        // console.log(window.location.pathname)
    }, [process.browser && window.location.pathname])

    return (
        <Menu mode='horizontal' selectedKeys={[current]} style={{ color: "white", backgroundColor: "#1a6aff", height: "3rem", alignItems: "center"}}>
            <Item
                key="/"
                onClick={(e) => setCurrent(e.key)}
                icon={<AppstoreAddOutlined />}
            >
                <Link legacyBehavior href='/'>
                    <a>App</a>
                </Link>
            </Item>
            <SubMenu
                icon={<CoffeeOutlined />}
                title={"Menu"}
                className="float-right"
                style={{ position: "absolute", right: "2rem" }}
            >
                <ItemGroup className='float-right'>
                    <Item
                        key="/user"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<UserAddOutlined />}
                    >
                        <Link legacyBehavior
                            href='/user'>
                            <a>DashBoard</a>
                        </Link>
                    </Item>
                    {/* <Item
                        onClick={logOut}
                        icon={<LogoutOutlined />}
                        style={{ "float": "end" }}
                    >
                        Logout
                    </Item> */}
                </ItemGroup>
            </SubMenu>
        </Menu>
    )
}

export default TopNav