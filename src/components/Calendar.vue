<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="dialog = true">
            <v-icon>mdi-plus-box-multiple-outline</v-icon>
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next" class="mr-4">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form class="px-2 py-1" @submit.prevent="addEvent">
              <v-text-field
                v-model="name"
                type="text"
                label="Topic(required)"
              ></v-text-field>
              <v-text-field
                v-model="details"
                type="text"
                label="Detail"
              ></v-text-field>
              <v-text-field
                v-model="start"
                type="date"
                label="Start Date (required)"
              ></v-text-field>
              <v-text-field
                v-model="end"
                type="date"
                label="End Date (required)"
              ></v-text-field>
              <v-select
                v-model="color"
                type="color"
                :items="colorOptions"
                label="Color"
                placeholder="use default or click to custimize"
              ></v-select>
              <p class="text-center">
                <v-color-picker
                  flat
                  hide-canvas
                  hide-inputs
                  v-model="color"
                  type="color hex"
                  width="450"
                ></v-color-picker>
              </p>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  block
                  class="mt-4"
                  type="submit"
                  @click.stop="dialog = false"
                >
                  トピック追加<v-icon right>mdi-upload</v-icon>
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="selectedOpen = false">
                <v-icon>mdi-chevron-left-box</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="deleteEvent(selectedEvent.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.details }}
              </form>
              <form v-else>
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                  style="width:100%"
                  :min-height="100"
                  placeholder="add note"
                ></textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                icon
                tile
                block
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent)"
              >
                <span>編集</span>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                tile
                block
                v-else
                @click.prevent="updateEvent(selectedEvent)"
              >
                <span>保存</span>
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '@/main';
export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: '#1976D2',
    colorOptions: [
      { text: 'Dark Blue', value: '#1976D2' },
      { text: 'Red', value: '#F44336' },
      { text: 'Pink', value: '#E91E63' },
      { text: 'Purple', value: '#9C27B0' },
      { text: 'Deep Purple', value: '#673AB7' },
      { text: 'Indigo', value: '#3F51B5' },
      { text: 'Blue', value: '#2196F3' },
      { text: 'Light Blue', value: '#03A9F4' },
      { text: 'Cyan', value: '#00BCD4' },
      { text: 'Teal', value: '#009688' },
      { text: 'Green', value: '#4CAF50' },
      { text: 'Light Green', value: '#8BC34A' },
      { text: 'Lime', value: '#CDDC39' },
      { text: 'Amber', value: '#FFC107' },
      { text: 'Orange', value: '#FF9800' },
      { text: 'Deep Orange', value: '#FF5722' },
      { text: 'Brown', value: '#795548' },
      { text: 'Blue Gray', value: '#607D8B' },
      { text: 'Gray', value: '#9E9E9E' },
      { text: 'Dark Grey', value: '#424242' },
      { text: 'Black', value: '#000' },
    ],
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false,
    dialogDate: false,
    events: [
      {
        name: 'Vacation',
        details: 'Going to the beach!',
        start: '2019-12-21',
        end: '2019-12-21',
        color: 'blue',
      },
    ],
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? '' : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`;
        case 'week':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return '';
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long',
      });
    },
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection('setEvent').get();
      const events = [];
      snapshot.forEach(doc => {
        let eventData = doc.data();
        eventData.id = doc.id;
        events.push(eventData);
      });
      this.events = events;
    },
    async addEvent() {
      if (this.name && this.start && this.end) {
        await db.collection('setEvent').add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color,
        });
        this.getEvents();
        this.name = '';
        this.details = '';
        this.start = '';
        this.end = '';
        this.color = '#1976D2';
      } else {
        alert('Oops! There is no topic or time.');
      }
    },
    async updateEvent(event) {
      await db
        .collection('setEvent')
        .doc(this.currentlyEditing)
        .update({
          details: event.details,
        });
      this.currentlyEditing = null;
    },
    async deleteEvent(event) {
      await db
        .collection('setEvent')
        .doc(event)
        .delete();
      this.selectedOpen = false;
      this.getEvents();
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    editEvent(event) {
      this.currentlyEditing = event.id;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
    },
  },
};
</script>
