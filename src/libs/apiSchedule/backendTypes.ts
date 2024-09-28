export type GroupsTypesApiResponse = {
  /**
   * Тело где приходит вся информация о группах, университетах, факультетах и т.д.
   */
  data: {
    /**
     * Массив филиалов университета
     */
    children: {
      /**
       * Абравиатура филиалов университетов. Сейчас есть три филиала:
       * @example МГТУ им. Н. Э. Баумана
       * @example КФ МГТУ им. Н.Э. Баумана
       * @example МФ МГТУ им. Н.Э. Баумана
       */
      abbr: string;
      /**
       * Описание университетов
       * @example Федеральное государственное бюджетное образовательное учреждение высшего образования «Московский государственный технический университет имени Н. Э. Баумана (национальный исследовательский университет)»
       */
      name: string;
      /**
       * uuid университета
       * @example 8c1b7bb8-e690-11db-89c3-000cf1a7cbf0
       */
      uuid: string;
      /**
       * Массив факультетов университета
       */
      children: {
        /**
         * Абравиатура факультета
         * @example АК
         * @example БМТ
         * @example ИУ
         */
        abbr: string;
        /**
         * uuid факультета
         * @example a31b5b3d-82fc-1029-96dd-000347adedc6
         */
        uuid: string;
        /**
         * Массив кафедр университета
         */
        children: {
          /**
           * Абравиатура кафедры
           * @example АК1
           * @example БМТ1
           * @example ИУ6
           */
          abbr: string;
          /**
           * Массив кафедр по курсам университета
           */
          children: {
            /**
             * Абравиатура кафедры с курсом
             * @example АК1 (2 курс)
             * @example БМТ1 (1 курс)
             * @example ИУ6 (2 курс)
             */
            abbr: string;
            /**
             * Курс кафедры
             * @example 1
             */
            course: number;
            /**
             * Массив групп кафедры
             */
            children: {
              /**
               * Абравиатура группы
               * @example АК1-31
               * @example БМТ1-11
               * @example ИУ6-73
               */
              abbr: string;
              /**
               * Семестр на котором находится группа
               */
              semester: number;
              /**
               * uuid группы
               * @example a31b5b3d-82fc-1029-96dd-000347adedc6
               */
              uuid: string;
            }[]
          }[]
        }[]
      }[]
    }[]
  }
}

export type SchedulesTypesApiResponse = {
  /**
   * Тело где приходит вся информация о расписании группы
   */
  data: {
    /**
     * Название группы
     * @example ИУ6-73Б
     */
    title: string;
    /**
      * uuid группы
      * @example a31b5b3d-82fc-1029-96dd-000347adedc6
      */
    uuid: string;
    /**
     * Расписание группы
     */
    schedule: {
      /**
       * Тип аудитории
       */
      audiences: {
        /**
         * Название аудитории
         * @example 515ю
         */
        name: string;
        /**
          * uuid группы
          * @example a31b5b3d-82fc-1029-96dd-000347adedc6
          */
        uuid: string | null;
      }[];

      /**
       * Информация о дисциплине
       */
      discipline: {
        /**
         * Аббревиатура дисциплины
         * @example КиМТвРС
         */
        abbr: string;
        /**
         * Тип дисциплины
         * @example lecture
         * @example seminar
         */
        actType?: 'seminar' | 'lecture' | 'lab';
        /**
         * Полное название дисциплины
         * @example Коммутация и маршрутизация трафика в распределённых системах
         */
        fullName: string;
      };

      /**
       * Номер дня недели
       */
      day: 1 | 2 | 3 | 4 | 5 | 6;

      /**
       * Время окончания пары
       */
      endTime: string;

      /**
       * Время начала пары
       */
      startTime: string;

      /**
       * Группы у которых проходит пара
       */
      groups: {
        /**
         * Наименование группы
         * @example ИУ6-73Б
         */
        name: string;
        /**
          * uuid группы
          * @example a31b5b3d-82fc-1029-96dd-000347adedc6
          */
        uuid: string;
      }[];

      /**
       * Массив преподавателей ведущих предмет
       */
      teachers: {
        /** Имя преподавателя
         * @example Иван
         */
        firstName: string;
        /** Фамилия преподавателя
         * @example Иванов
         */
        lastName: string;
        /** Отчество преподавателя
         * @example Иванович
         */
        middleName: string;
        /**
          * uuid преподавателя
          * @example a31b5b3d-82fc-1029-96dd-000347adedc6
          */
        uuid: string;
      }[];

      /**
       * Видимо некий порядковый номер пары (времени)
       */
      time: number;

      /**
       * Тип недели (есть числитель/знаменатель)
       */
      week: 'zn' | 'all' | 'ch';
    }[]
  }
}