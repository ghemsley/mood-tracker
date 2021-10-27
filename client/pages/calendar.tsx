import type { NextPage } from 'next'
import { Calendar, List, Loader, Message, Panel, Popover, Whisper } from 'rsuite'
import { AiFillStar } from 'react-icons/ai'
import { MdMood } from 'react-icons/md'
import { FaHamburger } from 'react-icons/fa'
import { RiMedicineBottleLine } from 'react-icons/ri'
import { BiWalk } from 'react-icons/bi'
import { CgArrowDownO } from 'react-icons/cg'
import { GiWaterDrop } from 'react-icons/gi'
import { IoIosChatbubbles, IoMdJournal, IoIosMore } from 'react-icons/io'
import { MdVideogameAsset } from 'react-icons/md'
import { FunctionComponent, memo } from 'react'
import { DayObject } from '../models/day'
import apiHooks from '../api'
import styles from '../styles/listItem.module.scss'
const ListItem: FunctionComponent = ({ children }) => (
  <List.Item>
    <div className={styles.listItem}>{children}</div>
  </List.Item>
)

const defined = (variable: any) => {
  return typeof variable !== 'undefined' && variable !== null
}

const CalendarPage: NextPage = memo(() => {
  const [days, errors] = apiHooks.useFetchDaysByUser()
  const renderCell = (date: Date) => {
    const iconSize = 20
    const currentDay: DayObject | undefined = days?.find((day: DayObject) => {
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
                  <ListItem>
                    <AiFillStar size={iconSize} /> Rating: {currentDay.rating}
                  </ListItem>
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
                      <ListItem>
                        <IoMdJournal size={iconSize} />
                        Journal entry:
                        <IoIosMore size={iconSize} />
                      </ListItem>
                    </a>
                  </Whisper>
                )}
                {defined(currentDay.mood) && (
                  <ListItem>
                    <MdMood size={iconSize} /> Mood: {currentDay.mood}
                  </ListItem>
                )}
                {defined(currentDay.meals) && (
                  <ListItem>
                    <FaHamburger size={iconSize} /> Meals eaten: {currentDay.meals}
                  </ListItem>
                )}
                {defined(currentDay.water) && (
                  <ListItem>
                    <GiWaterDrop size={iconSize} /> Hydration: {currentDay.water} cups
                  </ListItem>
                )}
                {defined(currentDay.people) && (
                  <ListItem>
                    <IoIosChatbubbles size={iconSize} /> People talked to: {currentDay.people}
                  </ListItem>
                )}
                {defined(currentDay.activities) && (
                  <ListItem>
                    <MdVideogameAsset size={iconSize} /> Fun activities: {currentDay.water}
                  </ListItem>
                )}
                {defined(currentDay.meds) && (
                  <ListItem>
                    <RiMedicineBottleLine size={iconSize} /> Took meds:{' '}
                    {currentDay.meds ? 'yes' : 'no'}
                  </ListItem>
                )}
                {defined(currentDay.exercise) && (
                  <ListItem>
                    <BiWalk size={iconSize} /> Exercised: {currentDay.exercise ? 'yes' : 'no'}
                  </ListItem>
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

  return errors && errors.length > 0 ? (
    <Panel header="Calendar" collapsible defaultExpanded bordered>
      <Message showIcon closable type="error" header="Error">
        {errors.map((error: { message: string }, i: number) => (
          <p key={i}>{error.message}</p>
        ))}
      </Message>
    </Panel>
  ) : days ? (
    days.length > 0 ? (
      <Panel header="Calendar" collapsible defaultExpanded bordered>
        <Calendar bordered renderCell={renderCell} />
      </Panel>
    ) : (
      <Panel header="Calendar" collapsible defaultExpanded bordered>
        <p>There are no entries to display</p>
      </Panel>
    )
  ) : (
    <Loader center size="lg" content="loading..." />
  )
})

CalendarPage.displayName = 'Calendar'

export default CalendarPage
