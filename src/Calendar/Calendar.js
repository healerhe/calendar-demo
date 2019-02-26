import React, { Component } from 'react';
import './Calendar.css';


let daysInMonth = [];
let dateReg = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
const displayDaysPerMonth = (year) => {

    //定义每个月的天数，如果是闰年第二月改为29天
    daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29
    }

    //以下为了获取一年中每一个月在日历选择器上显示的数据，
    //从上个月开始，接着是当月，最后是下个月开头的几天

    //定义一个数组，保存上一个月的天数
    let daysInPreviousMonth = [].concat(daysInMonth)
    daysInPreviousMonth.unshift(daysInPreviousMonth.pop())

    //获取每一个月显示数据中需要补足上个月的天数
    let addDaysFromPreMonth = new Array(12)
        .fill(null)
        .map((item, index) => {
            // index代表月份month，0代表一月份。。。依次11代表12月份
            let day = new Date(year, index, 1).getDay() // 代表获取每个月的第一天是星期几
            if (day === 0) {
                return 6
            } else {
                return day - 1
            }
        })
    //以数组形式返回一年中每个月的显示数据,每个数据为6行*7天
    return new Array(12)
        .fill([])
        .map((month, monthIndex) => {
            //monthIndex 代表月份1-12,下标是0-11
            let addDays = addDaysFromPreMonth[monthIndex], // 获取对应月份显示数据中需要补足上个月的天数
                daysCount = daysInMonth[monthIndex], // 获取对应月份的天数
                daysCountPrevious = daysInPreviousMonth[monthIndex], // 拿到对应月份上一个月份的天数
                monthData = []
            //补足上一个月
            for (; addDays > 0; addDays--) {
                monthData.unshift(daysCountPrevious--)
            }
            //添入当前月
            for (let i = 0; i < daysCount;) {
                monthData.push(++i)
            }
            //补足下一个月
            for (let i = 42 - monthData.length, j = 0; j < i;) {
                monthData.push(++j)
            }
            return monthData
        })
}

class Calendar extends Component {
    constructor(props) {
        super(props);
        let now = new Date();
        this.state = {
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate(),
            dataFlag: this.props.dataPickFlag // 日期选择下拉列表是否显示
        }
    }
    //手动修改日期的函数
    changeDate = (e) => {
        if (dateReg.exec(e.target.value)) {
            let valueArr = e.target.value.split("-");
            let value = valueArr.map(item => {
                return +item;
            });
            this.setState({
                year: value[0],
                month: value[1] - 1,
                day: value[2]
            });
            this.setState({
                datePicked: e.target.value
            });
        } else {
            this.setState({
                datePicked: e.target.value
            });
        }
    }
    //切换到下一个月
    nextMonth() {
        let { year, month } = this.state;
        if (month === 11) {
            this.setState({
                year: ++year,
                month: 0
            },()=>{
                this.setDatePicked();
            })
        } else {
            this.setState({
                month: ++month
            },()=>{
                this.setDatePicked();
            })
        }
    }
    //切换到上一个月
    prevMonth() {
        let { year, month } = this.state;
        if (month === 0) {
            this.setState({
                year: --year,
                month: 11
            },()=>{
                this.setDatePicked();
            })
        } else {
            this.setState({
                month: --month
            },()=>{
                this.setDatePicked();
            })
        }
    }


    // 获取某年某月一共多少天
    getDaysInMonth = (year, month) => {
        let date = new Date(year, month, 1);
        return new Date(date.getTime() - 864e5).getDate();
    }

    //前一天
    preDay = () => {
        let { year, month, day } = this.state;
        let perDay = month === 0 ? this.getDaysInMonth(year - 1, 12) : this.getDaysInMonth(year, month);
        if (day === 1) {
            this.prevMonth();
            this.setState({
                day: perDay
            },()=>{
                this.setDatePicked();
            })
        } else {
            this.setState({
                day: --day
            },()=>{
                this.setDatePicked();
            })
        }
    }

    //后一天
    nextDay = () => {
        let { month, day } = this.state;
        if (day === daysInMonth[month]) {
            this.nextMonth();
            this.setState({
                day: 1
            },()=>{
                this.setDatePicked();
            });
        } else {
            this.setState({
                day: ++day
            },()=>{
                this.setDatePicked();
            })
        }
    }

    //选择日期
    datePick(day) {
        this.setState({ day }, function () {
            this.setDatePicked();
        })
        this.datePickerToggle();
    }

    //切换日期选择器是否显示
    datePickerToggle() {
        this.setState({
            dataFlag: !this.state.dataFlag
        });
    }

    //处理日期选择事件，如果是当月，触发日期选择；如果不是当月，切换月份
    handleDatePick(index, styleName) {
        let viewData = displayDaysPerMonth(this.state.year); // 获取一年中所有月份的日期
        let flag = styleName.split(" ")[1];
        // eslint-disable-next-line
        switch (flag) {
            case 'thisMonth':
                let month = viewData[this.state.month]
                this.datePick(month[index])
                break
            case 'prevMonth':
                this.prevMonth()
                break
            case 'nextMonth':
                this.nextMonth()
                break
        }
    }

    //将日期设置为今天
    setToday = () => {
        let now = new Date();
        this.setState({
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate(),
            dataFlag: false
        },function(){
            this.setDatePicked();
        });
    }

    //设置datePicked
    setDatePicked = ()=> {
        let { year, month, day } = this.state;
        let monthTmp = (month + 1) >= 10 ? (month + 1) : ("0" + (month + 1));
        let dayTmp = day >= 10 ? day : ("0" + day);
        let datePicked = year + "-" + monthTmp + "-" + dayTmp;
        this.setState({
            datePicked: datePicked
        });
    }

    //回车事件
    handlerEnter = (e) => {
        if (e.keyCode === 13) {
            this.setDatePicked();
            this.datePickerToggle();
        }
    }


    render() {
        let viewData = displayDaysPerMonth(this.state.year); // 获取一年中所有月份的日期
        //确定当前月数据中每一天所属的月份，以此赋予不同className
        let month = viewData[this.state.month],
            rowsInMonth = [],
            i = 0,
            styleOfDays = (() => {
                let i = month.indexOf(1),
                    j = month.indexOf(1, i + 1),
                    arr = new Array(43)
                arr.fill('calendar-date prevMonth', 0, i + 1)
                arr.fill('calendar-date thisMonth', i + 1, j + 1)
                arr.fill('calendar-date nextMonth', j + 1)
                return arr
            })()

        //把每一个月的显示数据以7天为一组等分
        month.forEach((day, index) => {
            if (index % 7 === 0) {
                rowsInMonth.push(month.slice(index, index + 7))
            }
        });
        return (
            <div className="Calendar" id="Calendar">
                <div className={!this.state.dataFlag ? "Calendar-input-wrapper show" : "hide"}>
                    <input type="text" placeholder="请选择日期" className="Calendar-input" onClick={this.datePickerToggle.bind(this)} value={this.state.datePicked?this.state.datePicked:""} onChange={this.changeDate.bind(this)} />
                </div>
                <div className={this.state.dataFlag ? "Calendar-content-wrapper show" : "Calendar-content-wrapper hide"} >
                    <div className="Calendar-header">
                        <div className="Calendar-header-choose">
                            <input type="text" placeholder="请选择日期" className="Calendar-header-choose-input" value={this.state.datePicked?this.state.datePicked:""} onChange={this.changeDate.bind(this)} onKeyDown={this.handlerEnter.bind(this)}></input>
                        </div>
                        <div className="Calendar-header-content">
                            <span className="start" onClick={this.prevMonth.bind(this)}></span>
                            <span className="pre" onClick={this.preDay.bind(this)}></span>
                            <div className="content"> {this.state.year + "年" + (this.state.month + 1) + "月"} </div>
                            <span className="next" onClick={this.nextDay.bind(this)}></span>
                            <span className="end" onClick={this.nextMonth.bind(this)}></span>
                        </div>
                    </div>
                    <div className="Calendar-main">
                        <table className="calendar-main-table">
                            <thead>
                                <tr>
                                    <th title="周一" className="calendar-column-header">一</th>
                                    <th title="周二" className="calendar-column-header">二</th>
                                    <th title="周三" className="calendar-column-header">三</th>
                                    <th title="周四" className="calendar-column-header">四</th>
                                    <th title="周五" className="calendar-column-header">五</th>
                                    <th title="周六" className="calendar-column-header">六</th>
                                    <th title="周日" className="calendar-column-header">日</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rowsInMonth.map((row, rowIndex) => {
                                        return (
                                            <tr key={rowIndex}>
                                                {
                                                    row.map((day) => {
                                                        return (
                                                            <td onClick={this.handleDatePick.bind(this, i, styleOfDays[i + 1])}
                                                                key={i++}>
                                                                <div className={day === this.state.day && styleOfDays[i].split(" ")[1] === "thisMonth" ? "calendar-date-active " + styleOfDays[i] : styleOfDays[i]}> {day} </div>
                                                            </td>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="Calendar-footer">
                        <span onClick={this.setToday}>今天</span>
                    </div>
                </div>
            </div>
        );
    }
}

Calendar.defaultProps = {
    dataPickFlag : false
}

export default Calendar;
