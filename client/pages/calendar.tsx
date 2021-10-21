import type { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { Calendar, List, Loader, Panel, Popover, Whisper } from 'rsuite'
import { AiFillStar } from 'react-icons/ai'
import { MdMood } from 'react-icons/md'
import { FaHamburger } from 'react-icons/fa'
import { RiMedicineBottleLine } from 'react-icons/ri'
import { BiWalk } from 'react-icons/bi'
import { CgArrowDownO } from 'react-icons/cg'
import { GiWaterDrop } from 'react-icons/gi'
import { IoIosChatbubbles, IoMdJournal, IoIosMore } from 'react-icons/io'
import { MdVideogameAsset } from 'react-icons/md'
import { FunctionComponent, memo, useEffect, useState } from 'react'
import { DayObject } from '../models/day'
import apiHooks from '../api'
import styles from '../styles/listItem.module.scss'
import { UserObject } from '../models/user'
import Auth from '../components/auth'
import Redirect from '../components/redirect'

const ListItem: FunctionComponent = ({ children }) => (
  <div className={styles.listItem}>{children}</div>
)

const defined = (variable: any) => {
  return typeof variable !== 'undefined' && variable !== null
}

const CalendarPage: NextPage = memo(() => {
  const user: UserObject | null | undefined = useSelector(state => state.user.currentUser)
  const days: DayObject[] = useSelector(state => state.days)
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<{ message: string }[] | undefined>(undefined)
  useEffect(() => {
    !!user && !start && !done && setStart(true)
  }, [user, start, done])
  apiHooks.useFetchDays(undefined, { userId: user?.id }, start && !done).then(data => {
    start && setStart(false)
    !done && setDone(true)
  })
  const renderCell = (date: Date) => {
    const iconSize = 20
    const currentDay: DayObject | undefined = days.find((day: DayObject) => {
      return day && day.createdAt
        ? new Date(day.createdAt).toDateString() === date.toDateString()
        : false
    })
    if (currentDay) {
      return (
        <Whisper
          trigger="click"
          placement="bottom"
          speaker={
            <Popover title={new Date(currentDay.createdAt as number).toLocaleDateString()}>
              <List>
                {defined(currentDay.rating) && (
                  <List.Item>
                    <ListItem>
                      <AiFillStar size={iconSize} /> Rating: {currentDay.rating}
                    </ListItem>
                  </List.Item>
                )}
                {defined(currentDay.journal) && (
                  <Whisper
                    trigger="hover"
                    placement="right"
                    speaker={
                      <Popover title="Journal entry" visible>
                        <p>{currentDay.journal}</p>
                      </Popover>
                    }
                  >
                    <a>
                      <List.Item>
                        <ListItem>
                          <IoMdJournal size={iconSize} />
                          Journal entry:
                          <IoIosMore size={iconSize} />
                        </ListItem>
                      </List.Item>
                    </a>
                  </Whisper>
                )}
                {defined(currentDay.mood) && (
                  <List.Item>
                    <ListItem>
                      <MdMood size={iconSize} /> Mood: {currentDay.mood}
                    </ListItem>
                  </List.Item>
                )}
                {defined(currentDay.meals) && (
                  <List.Item>
                    <ListItem>
                      <FaHamburger size={iconSize} /> Meals eaten: {currentDay.meals}
                    </ListItem>
                  </List.Item>
                )}
                {defined(currentDay.water) && (
                  <List.Item>
                    <ListItem>
                      <GiWaterDrop size={iconSize} /> Hydration: {currentDay.water} cups
                    </ListItem>
                  </List.Item>
                )}
                {defined(currentDay.people) && (
                  <List.Item>
                    <ListItem>
                      <IoIosChatbubbles size={iconSize} /> People talked to: {currentDay.people}
                    </ListItem>
                  </List.Item>
                )}
                {defined(currentDay.activities) && (
                  <List.Item>
                    <ListItem>
                      <MdVideogameAsset size={iconSize} /> Fun activities: {currentDay.water}
                    </ListItem>
                  </List.Item>
                )}
                {defined(currentDay.meds) && (
                  <List.Item>
                    <ListItem>
                      <RiMedicineBottleLine size={iconSize} /> Took meds:{' '}
                      {currentDay.meds ? 'yes' : 'no'}
                    </ListItem>
                  </List.Item>
                )}
                {defined(currentDay.exercise) && (
                  <List.Item>
                    <ListItem>
                      <BiWalk size={iconSize} /> Exercised: {currentDay.exercise ? 'yes' : 'no'}
                    </ListItem>
                  </List.Item>
                )}
              </List>
            </Popover>
          }
        >
          <a>
            <p style={{ textAlign: 'center' }}>
              See info
              <br />
              <CgArrowDownO size={iconSize} />
            </p>
          </a>
        </Whisper>
      )
    } else return <></>
  }

  return (
    <Auth>
      {user ? (
        days ? (
          days.length > 0 ? (
            <Panel header="Calendar" collapsible defaultExpanded bordered>
              <Calendar bordered renderCell={renderCell} />
            </Panel>
          ) : (
            <p>There is no data to display</p>
          )
        ) : (
          <Loader center size="lg" content="loading..." />
        )
      ) : (
        <Redirect to="/login" />
      )}
    </Auth>
  )
})

CalendarPage.displayName = 'Calendar'

export default CalendarPage
